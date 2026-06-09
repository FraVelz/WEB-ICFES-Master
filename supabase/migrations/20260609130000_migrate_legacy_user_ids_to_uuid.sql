-- Migración one-shot: IDs legacy (Firebase / text) → UUID de auth.users (Supabase).
--
-- IMPORTANTE
-- 1. Haz backup o snapshot del proyecto antes de ejecutar.
-- 2. Ejecuta primero el bloque "DIAGNÓSTICO" y revisa el resultado.
-- 3. Luego ejecuta "MIGRACIÓN" (descomenta COMMIT al final si usas BEGIN).
-- 4. Por último ejecuta el bloque de get_public_profile (archivo 20260609120000).
--
-- Empareja public.users con auth.users por email (case-insensitive).
-- Usuarios sin email o sin cuenta en auth.users NO se migran (quedan en el reporte).

-- ---------------------------------------------------------------------------
-- DIAGNÓSTICO (seguro, solo lectura)
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.is_valid_uuid(val text)
RETURNS boolean
LANGUAGE plpgsql
IMMUTABLE
AS $$
BEGIN
  IF val IS NULL OR btrim(val) = '' THEN
    RETURN false;
  END IF;
  PERFORM btrim(val)::uuid;
  RETURN true;
END;
$$;

CREATE OR REPLACE FUNCTION public.diagnose_legacy_user_ids()
RETURNS TABLE (
  users_id text,
  email text,
  id_kind text,
  auth_user_id uuid,
  can_migrate boolean,
  issue text
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    u.id AS users_id,
    u.email,
    CASE
      WHEN public.is_valid_uuid(u.id) THEN 'uuid_format'
      ELSE 'legacy_text'
    END AS id_kind,
    au.id AS auth_user_id,
    (au.id IS NOT NULL AND u.id IS DISTINCT FROM au.id::text) AS can_migrate,
    CASE
      WHEN au.id IS NULL THEN 'sin cuenta en auth.users (mismo email)'
      WHEN u.id = au.id::text THEN 'ok — ya usa UUID de Supabase Auth'
      WHEN EXISTS (
        SELECT 1 FROM public.users u2
        WHERE u2.id = au.id::text AND u2.id <> u.id
      ) THEN 'duplicado — perfil UUID y legacy con mismo email (se fusionará)'
      ELSE 'pendiente — se puede migrar a auth.users.id'
    END AS issue
  FROM public.users u
  LEFT JOIN auth.users au
    ON u.email IS NOT NULL
   AND btrim(u.email) <> ''
   AND lower(btrim(u.email)) = lower(btrim(au.email))
  ORDER BY can_migrate DESC, u.created_at NULLS LAST;
$$;

REVOKE ALL ON FUNCTION public.diagnose_legacy_user_ids() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.diagnose_legacy_user_ids() TO service_role;

-- Ejecutar en SQL Editor:
--   SELECT * FROM public.diagnose_legacy_user_ids();

-- ---------------------------------------------------------------------------
-- MIGRACIÓN
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.migrate_legacy_user_ids_to_auth_uuid()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  rec record;
  migrated_count int := 0;
  merge_ops_count int := 0;
  profiles_created int := 0;
  skipped_count int := 0;
  unmigrated jsonb := '[]'::jsonb;
  migrated jsonb := '[]'::jsonb;
  old_id text;
  new_id text;
  has_target_user boolean;
  has_target_gam boolean;
  has_target_progress boolean;
BEGIN
  ALTER TABLE public.users
    ADD COLUMN IF NOT EXISTS legacy_firebase_id text;

  FOR rec IN
    SELECT DISTINCT ON (u.id)
      u.id AS old_id,
      au.id::text AS new_id,
      u.email
    FROM public.users u
    INNER JOIN auth.users au
      ON u.email IS NOT NULL
     AND btrim(u.email) <> ''
     AND lower(btrim(u.email)) = lower(btrim(au.email))
    WHERE u.id IS DISTINCT FROM au.id::text
    ORDER BY u.id, au.created_at DESC
  LOOP
    old_id := rec.old_id;
    new_id := rec.new_id;

    SELECT EXISTS (SELECT 1 FROM public.users WHERE id = new_id) INTO has_target_user;

    -- --- user_gamification ---
    SELECT EXISTS (
      SELECT 1 FROM public.user_gamification WHERE user_id = new_id
    ) INTO has_target_gam;

    IF EXISTS (SELECT 1 FROM public.user_gamification WHERE user_id = old_id) THEN
      IF has_target_gam THEN
        UPDATE public.user_gamification g_new
        SET
          xp = GREATEST(COALESCE(g_new.xp, 0), COALESCE(g_old.xp, 0)),
          total_coins = GREATEST(COALESCE(g_new.total_coins, 0), COALESCE(g_old.total_coins, 0)),
          spent_coins = GREATEST(COALESCE(g_new.spent_coins, 0), COALESCE(g_old.spent_coins, 0)),
          longest_streak = GREATEST(COALESCE(g_new.longest_streak, 0), COALESCE(g_old.longest_streak, 0)),
          achievements = COALESCE(g_new.achievements, '{}'::jsonb) || COALESCE(g_old.achievements, '{}'::jsonb),
          streak_dates = COALESCE(g_new.streak_dates, '[]'::jsonb) || COALESCE(g_old.streak_dates, '[]'::jsonb),
          xp_history = COALESCE(g_new.xp_history, '[]'::jsonb) || COALESCE(g_old.xp_history, '[]'::jsonb),
          coins_history = COALESCE(g_new.coins_history, '[]'::jsonb) || COALESCE(g_old.coins_history, '[]'::jsonb)
        FROM public.user_gamification g_old
        WHERE g_new.user_id = new_id
          AND g_old.user_id = old_id;

        DELETE FROM public.user_gamification WHERE user_id = old_id;
        merge_ops_count := merge_ops_count + 1;
      ELSE
        UPDATE public.user_gamification SET user_id = new_id WHERE user_id = old_id;
      END IF;
    END IF;

    -- --- user_progress ---
    SELECT EXISTS (
      SELECT 1 FROM public.user_progress WHERE user_id = new_id
    ) INTO has_target_progress;

    IF EXISTS (SELECT 1 FROM public.user_progress WHERE user_id = old_id) THEN
      IF has_target_progress THEN
        UPDATE public.user_progress p_new
        SET
          total_attempts = COALESCE(p_new.total_attempts, 0) + COALESCE(p_old.total_attempts, 0),
          total_correct = COALESCE(p_new.total_correct, 0) + COALESCE(p_old.total_correct, 0),
          percentage = GREATEST(COALESCE(p_new.percentage, 0), COALESCE(p_old.percentage, 0)),
          streak_days = GREATEST(COALESCE(p_new.streak_days, 0), COALESCE(p_old.streak_days, 0)),
          area_stats = COALESCE(p_new.area_stats, '{}'::jsonb) || COALESCE(p_old.area_stats, '{}'::jsonb),
          last_activity_date = GREATEST(p_new.last_activity_date, p_old.last_activity_date)
        FROM public.user_progress p_old
        WHERE p_new.user_id = new_id
          AND p_old.user_id = old_id;

        DELETE FROM public.user_progress WHERE user_id = old_id;
      ELSE
        UPDATE public.user_progress SET user_id = new_id WHERE user_id = old_id;
      END IF;
    END IF;

    -- --- exam_results (user_id + ids compuestos migrated_*) ---
    UPDATE public.exam_results er
    SET
      user_id = new_id,
      id = CASE
        WHEN er.id LIKE 'migrated_' || old_id || '_%'
          THEN 'migrated_' || new_id || '_' || substring(er.id from length('migrated_' || old_id || '_') + 1)
        ELSE er.id
      END
    WHERE er.user_id = old_id;

    -- --- user_plans (si existe la tabla) ---
    IF to_regclass('public.user_plans') IS NOT NULL THEN
      IF EXISTS (SELECT 1 FROM public.user_plans WHERE user_id = old_id) THEN
        IF EXISTS (SELECT 1 FROM public.user_plans WHERE user_id = new_id) THEN
          DELETE FROM public.user_plans WHERE user_id = old_id;
        ELSE
          UPDATE public.user_plans SET user_id = new_id WHERE user_id = old_id;
        END IF;
      END IF;
    END IF;

    -- --- users (PK) ---
    IF has_target_user THEN
      UPDATE public.users u_keep
      SET
        legacy_firebase_id = COALESCE(u_keep.legacy_firebase_id, old_id),
        display_name = COALESCE(NULLIF(btrim(u_keep.display_name), ''), u_old.display_name),
        username = COALESCE(u_keep.username, u_old.username),
        bio = COALESCE(u_keep.bio, u_old.bio),
        profile_image = COALESCE(u_keep.profile_image, u_old.profile_image),
        skill_level = COALESCE(u_keep.skill_level, u_old.skill_level),
        level_assessment_completed_at = COALESCE(
          u_keep.level_assessment_completed_at,
          u_old.level_assessment_completed_at
        ),
        updated_at = now()
      FROM public.users u_old
      WHERE u_keep.id = new_id
        AND u_old.id = old_id;

      DELETE FROM public.users WHERE id = old_id;
      merge_ops_count := merge_ops_count + 1;
    ELSE
      UPDATE public.users
      SET
        legacy_firebase_id = COALESCE(legacy_firebase_id, id),
        id = new_id,
        updated_at = now()
      WHERE id = old_id;
    END IF;

    migrated_count := migrated_count + 1;
    migrated := migrated || jsonb_build_array(
      jsonb_build_object('from', old_id, 'to', new_id, 'email', rec.email)
    );
  END LOOP;

  -- Perfiles auth.users que aún no tienen fila en public.users
  WITH inserted AS (
    INSERT INTO public.users (id, email, display_name, created_at, updated_at)
    SELECT
      au.id::text,
      au.email,
      COALESCE(
        NULLIF(btrim(au.raw_user_meta_data->>'full_name'), ''),
        NULLIF(btrim(au.raw_user_meta_data->>'name'), ''),
        NULLIF(split_part(au.email, '@', 1), ''),
        'Usuario ICFES'
      ),
      COALESCE(au.created_at, now()),
      now()
    FROM auth.users au
    WHERE NOT EXISTS (
      SELECT 1 FROM public.users u WHERE u.id = au.id::text
    )
    RETURNING id
  )
  SELECT COUNT(*)::int INTO profiles_created FROM inserted;

  -- Usuarios legacy sin match en auth.users
  SELECT COALESCE(jsonb_agg(jsonb_build_object(
    'users_id', u.id,
    'email', u.email,
    'reason', 'sin auth.users con el mismo email'
  )), '[]'::jsonb)
  INTO unmigrated
  FROM public.users u
  LEFT JOIN auth.users au
    ON u.email IS NOT NULL
   AND btrim(u.email) <> ''
   AND lower(btrim(u.email)) = lower(btrim(au.email))
  WHERE au.id IS NULL
    AND NOT public.is_valid_uuid(u.id);

  -- Usuarios ya correctos
  SELECT COUNT(*) INTO skipped_count
  FROM public.users u
  INNER JOIN auth.users au
    ON lower(btrim(u.email)) = lower(btrim(au.email))
  WHERE u.id = au.id::text;

  RETURN jsonb_build_object(
    'migrated', migrated_count,
    'merge_operations', merge_ops_count,
    'profiles_created_from_auth', profiles_created,
    'already_ok', skipped_count,
    'migrated_pairs', migrated,
    'unmigrated_legacy', unmigrated
  );
END;
$$;

REVOKE ALL ON FUNCTION public.migrate_legacy_user_ids_to_auth_uuid() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.migrate_legacy_user_ids_to_auth_uuid() TO service_role;

-- Ejecutar migración (recomendado dentro de transacción):
--
-- BEGIN;
-- SELECT public.migrate_legacy_user_ids_to_auth_uuid();
-- -- Revisar el JSON. Si todo está bien:
-- COMMIT;
-- -- Si algo falla:
-- -- ROLLBACK;

-- Verificación post-migración:
--   SELECT * FROM public.diagnose_legacy_user_ids() WHERE issue NOT LIKE 'ok%';
--   SELECT id, email, legacy_firebase_id FROM public.users WHERE legacy_firebase_id IS NOT NULL;
