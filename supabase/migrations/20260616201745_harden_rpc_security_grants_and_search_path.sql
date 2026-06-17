-- Harden public RPC security (shared by WEB-ICFES-Master, app móvil, WEB-ICFES-Admin).

-- 1) Require authenticated caller for user-scoped RPCs (blocks anon abuse).
CREATE OR REPLACE FUNCTION public.add_weekly_xp(p_user_id uuid, p_points integer)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
DECLARE
  v_week text := public.iso_week_id();
  v_current_week text;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'No autenticado';
  END IF;

  IF auth.uid()::text IS DISTINCT FROM p_user_id::text THEN
    RAISE EXCEPTION 'No autorizado para sumar XP semanal a otro usuario';
  END IF;

  IF p_points <= 0 THEN
    RETURN;
  END IF;

  SELECT weekly_xp_week INTO v_current_week
  FROM public.user_gamification
  WHERE user_id::text = p_user_id::text;

  IF v_current_week IS DISTINCT FROM v_week THEN
    UPDATE public.user_gamification
    SET weekly_xp = p_points, weekly_xp_week = v_week, updated_at = now()
    WHERE user_id::text = p_user_id::text;
  ELSE
    UPDATE public.user_gamification
    SET weekly_xp = weekly_xp + p_points, weekly_xp_week = v_week, updated_at = now()
    WHERE user_id::text = p_user_id::text;
  END IF;
END;
$function$;

CREATE OR REPLACE FUNCTION public.assign_league_group(p_user_id uuid, p_league_rank text)
 RETURNS uuid
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
DECLARE
  v_group_id uuid;
  v_size int := public.league_group_size();
BEGIN
  IF auth.uid() IS NULL THEN
    IF COALESCE(auth.jwt() ->> 'role', '') IS DISTINCT FROM 'service_role' THEN
      RAISE EXCEPTION 'No autenticado';
    END IF;
  ELSIF auth.uid()::text IS DISTINCT FROM p_user_id::text THEN
    RAISE EXCEPTION 'No autorizado para asignar grupo a otro usuario';
  END IF;

  IF p_league_rank IS NULL OR p_league_rank NOT IN (
    'novato', 'explorador', 'aprendiz', 'competente', 'avanzado', 'experto', 'maestro'
  ) THEN
    RAISE EXCEPTION 'Liga inválida: %', p_league_rank;
  END IF;

  PERFORM public.leave_league_group(p_user_id);

  SELECT id INTO v_group_id
  FROM public.league_groups
  WHERE league_rank = p_league_rank AND member_count < v_size
  ORDER BY member_count DESC, created_at ASC
  LIMIT 1
  FOR UPDATE SKIP LOCKED;

  IF v_group_id IS NULL THEN
    INSERT INTO public.league_groups (league_rank, member_count)
    VALUES (p_league_rank, 0)
    RETURNING id INTO v_group_id;
  END IF;

  UPDATE public.user_gamification
  SET
    league_rank = p_league_rank,
    league_group_id = v_group_id,
    updated_at = now()
  WHERE user_id::text = p_user_id::text;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Usuario sin fila de gamificación: %', p_user_id;
  END IF;

  UPDATE public.league_groups
  SET member_count = member_count + 1
  WHERE id = v_group_id;

  RETURN v_group_id;
END;
$function$;

-- 2) Immutable helpers: fixed search_path (Supabase linter 0011).
CREATE OR REPLACE FUNCTION public.league_group_size()
 RETURNS integer
 LANGUAGE sql
 IMMUTABLE
 SET search_path TO ''
AS $function$
  SELECT 30;
$function$;

CREATE OR REPLACE FUNCTION public.iso_week_id(ts timestamp with time zone DEFAULT now())
 RETURNS text
 LANGUAGE sql
 STABLE
 SET search_path TO ''
AS $function$
  SELECT TO_CHAR(ts AT TIME ZONE 'America/Bogota', 'IYYY') || '-W' || TO_CHAR(ts AT TIME ZONE 'America/Bogota', 'IW');
$function$;

CREATE OR REPLACE FUNCTION public.league_achievement_id(p_rank text)
 RETURNS text
 LANGUAGE sql
 IMMUTABLE
 SET search_path TO ''
AS $function$
  SELECT CASE p_rank
    WHEN 'explorador' THEN 'league_explorador'
    WHEN 'aprendiz' THEN 'league_aprendiz'
    WHEN 'competente' THEN 'league_competente'
    WHEN 'avanzado' THEN 'league_avanzado'
    WHEN 'experto' THEN 'league_experto'
    WHEN 'maestro' THEN 'league_maestro'
    ELSE NULL
  END;
$function$;

CREATE OR REPLACE FUNCTION public.next_league_rank(p_rank text)
 RETURNS text
 LANGUAGE sql
 STABLE
 SET search_path TO ''
AS $function$
  SELECT c2.league_rank
  FROM public.league_rank_config c1
  JOIN public.league_rank_config c2 ON c2.sort_order = c1.sort_order + 1
  WHERE c1.league_rank = p_rank
  LIMIT 1;
$function$;

CREATE OR REPLACE FUNCTION public.prev_league_rank(p_rank text)
 RETURNS text
 LANGUAGE sql
 STABLE
 SET search_path TO ''
AS $function$
  SELECT c2.league_rank
  FROM public.league_rank_config c1
  JOIN public.league_rank_config c2 ON c2.sort_order = c1.sort_order - 1
  WHERE c1.league_rank = p_rank
  LIMIT 1;
$function$;

CREATE OR REPLACE FUNCTION public.is_valid_uuid(val text)
 RETURNS boolean
 LANGUAGE plpgsql
 IMMUTABLE
 SET search_path TO ''
AS $function$
BEGIN
  IF val IS NULL OR btrim(val) = '' THEN
    RETURN false;
  END IF;
  PERFORM btrim(val)::uuid;
  RETURN true;
END;
$function$;

-- 3) EXECUTE grants: authenticated/service_role only where clients need RPC; cron/admin via service_role.
REVOKE ALL ON FUNCTION public.add_weekly_xp(uuid, integer) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.add_weekly_xp(uuid, integer) TO authenticated, service_role;

REVOKE ALL ON FUNCTION public.assign_league_group(uuid, text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.assign_league_group(uuid, text) TO authenticated, service_role;

REVOKE ALL ON FUNCTION public.get_my_league_state() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_my_league_state() TO authenticated, service_role;

REVOKE ALL ON FUNCTION public.get_my_leaderboard() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_my_leaderboard() TO authenticated, service_role;

REVOKE ALL ON FUNCTION public.leave_league_group(uuid) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.leave_league_group(uuid) TO service_role;

REVOKE ALL ON FUNCTION public.unlock_league_achievement(uuid, text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.unlock_league_achievement(uuid, text) TO service_role;

REVOKE ALL ON FUNCTION public.backfill_league_groups() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.backfill_league_groups() TO service_role;

REVOKE ALL ON FUNCTION public.process_weekly_leagues() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.process_weekly_leagues() TO service_role;

REVOKE ALL ON FUNCTION public.diagnose_legacy_user_ids() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.diagnose_legacy_user_ids() TO service_role;

REVOKE ALL ON FUNCTION public.migrate_legacy_user_ids_to_auth_uuid() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.migrate_legacy_user_ids_to_auth_uuid() TO service_role;

REVOKE ALL ON FUNCTION public.exam_questions_admin_list() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.exam_questions_admin_list() TO authenticated, service_role;

-- Public profiles (web cliente sin sesión).
REVOKE ALL ON FUNCTION public.get_public_profile(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_public_profile(text) TO anon, authenticated, service_role;
