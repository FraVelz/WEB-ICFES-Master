-- Perfiles públicos: lectura anónima de campos limitados (sin email ni historial).
-- Ejecutar TODO este bloque en Supabase → SQL Editor → Run.
--
-- Si aún hay IDs legacy de Firebase, ejecuta antes:
--   supabase/migrations/20260609130000_migrate_legacy_user_ids_to_uuid.sql
--
-- Verificar después:
--   SELECT public.get_public_profile('TU-UUID-DE-AUTH');
--   (null = no existe ese usuario en la tabla users)

DROP FUNCTION IF EXISTS public.get_public_profile(uuid);
DROP FUNCTION IF EXISTS public.get_public_profile(text);

CREATE OR REPLACE FUNCTION public.get_public_profile(p_user_id text)
RETURNS jsonb
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  result jsonb;
BEGIN
  SELECT jsonb_build_object(
    'profile', jsonb_build_object(
      'id', u.id,
      'displayName', u.display_name,
      'username', u.username,
      'bio', u.bio,
      'profileImage', u.profile_image,
      'createdAt', u.created_at
    ),
    'gamification', jsonb_build_object(
      'xp', COALESCE(g.xp, 0),
      'achievements', COALESCE(g.achievements, '{}'::jsonb)
    )
  )
  INTO result
  FROM users u
  LEFT JOIN user_gamification g ON g.user_id = u.id
  WHERE u.id = p_user_id;

  RETURN result;
END;
$$;

REVOKE ALL ON FUNCTION public.get_public_profile(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_public_profile(text) TO anon, authenticated, service_role;

NOTIFY pgrst, 'reload schema';
