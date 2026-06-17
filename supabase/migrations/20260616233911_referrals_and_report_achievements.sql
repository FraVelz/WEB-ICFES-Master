-- Referidos + contadores de logros por reportes (web, app, admin).

-- ---------------------------------------------------------------------------
-- 1) users: código de invitación + referidor
-- ---------------------------------------------------------------------------
ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS referral_code text,
  ADD COLUMN IF NOT EXISTS referred_by text REFERENCES public.users(id);

CREATE UNIQUE INDEX IF NOT EXISTS users_referral_code_key ON public.users (referral_code)
  WHERE referral_code IS NOT NULL;

-- Genera código alfanumérico de 8 caracteres (sin 0/O/1/I para legibilidad).
CREATE OR REPLACE FUNCTION public.generate_referral_code()
RETURNS text
LANGUAGE plpgsql
SET search_path TO ''
AS $function$
DECLARE
  v_chars text := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  v_code text;
  v_i int;
BEGIN
  LOOP
    v_code := '';
    FOR v_i IN 1..8 LOOP
      v_code := v_code || substr(v_chars, floor(random() * length(v_chars) + 1)::int, 1);
    END LOOP;
    EXIT WHEN NOT EXISTS (
      SELECT 1 FROM public.users u WHERE u.referral_code = v_code
    );
  END LOOP;
  RETURN v_code;
END;
$function$;

CREATE OR REPLACE FUNCTION public.users_assign_referral_code()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
BEGIN
  IF NEW.referral_code IS NULL OR NEW.referral_code = '' THEN
    NEW.referral_code := public.generate_referral_code();
  END IF;
  RETURN NEW;
END;
$function$;

DROP TRIGGER IF EXISTS trg_users_assign_referral_code ON public.users;
CREATE TRIGGER trg_users_assign_referral_code
  BEFORE INSERT ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION public.users_assign_referral_code();

-- Backfill códigos para usuarios existentes
UPDATE public.users
SET referral_code = public.generate_referral_code()
WHERE referral_code IS NULL OR referral_code = '';

-- ---------------------------------------------------------------------------
-- 2) referrals
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.referrals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id text NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  invitee_id text NOT NULL UNIQUE REFERENCES public.users(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'qualified', 'rewarded')),
  source text CHECK (source IN ('web', 'app')),
  qualified_at timestamptz,
  rewarded_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT referrals_no_self CHECK (referrer_id <> invitee_id)
);

CREATE INDEX IF NOT EXISTS referrals_referrer_id_idx ON public.referrals (referrer_id);
CREATE INDEX IF NOT EXISTS referrals_status_idx ON public.referrals (status);

ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS referrals_select_own ON public.referrals;
CREATE POLICY referrals_select_own ON public.referrals
  FOR SELECT TO authenticated
  USING (auth.uid()::text = referrer_id OR auth.uid()::text = invitee_id);

-- Escritura solo service_role (API routes).

-- ---------------------------------------------------------------------------
-- 3) Contadores server-side en user_gamification
-- ---------------------------------------------------------------------------
ALTER TABLE public.user_gamification
  ADD COLUMN IF NOT EXISTS referral_qualified_count integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS support_approved_count integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS profile_report_approved_count integer NOT NULL DEFAULT 0;

-- ---------------------------------------------------------------------------
-- 4) RPC: aplicar código de referido al registrarse (una sola vez)
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.apply_referral_code(
  p_invitee_id text,
  p_referral_code text,
  p_source text DEFAULT 'web'
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
DECLARE
  v_referrer_id text;
  v_normalized text;
  v_source text;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'No autenticado';
  END IF;

  IF auth.uid()::text IS DISTINCT FROM p_invitee_id THEN
    RAISE EXCEPTION 'No autorizado';
  END IF;

  v_normalized := upper(trim(coalesce(p_referral_code, '')));
  IF v_normalized = '' THEN
    RETURN false;
  END IF;

  v_source := CASE WHEN p_source IN ('web', 'app') THEN p_source ELSE 'web' END;

  SELECT u.id INTO v_referrer_id
  FROM public.users u
  WHERE upper(u.referral_code) = v_normalized
  LIMIT 1;

  IF v_referrer_id IS NULL THEN
    RETURN false;
  END IF;

  IF v_referrer_id = p_invitee_id THEN
    RETURN false;
  END IF;

  -- referred_by inmutable: solo si aún es null
  UPDATE public.users
  SET referred_by = v_referrer_id
  WHERE id = p_invitee_id
    AND referred_by IS NULL;

  INSERT INTO public.referrals (referrer_id, invitee_id, status, source)
  VALUES (v_referrer_id, p_invitee_id, 'pending', v_source)
  ON CONFLICT (invitee_id) DO NOTHING;

  RETURN true;
END;
$function$;

REVOKE ALL ON FUNCTION public.apply_referral_code(text, text, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.apply_referral_code(text, text, text) TO authenticated;
