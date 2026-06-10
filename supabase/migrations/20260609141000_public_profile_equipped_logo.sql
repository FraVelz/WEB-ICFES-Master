-- Expone el logo equipado en perfiles públicos (el cliente resuelve la URL del catálogo).
-- Ejecutar TODO este bloque en Supabase → SQL Editor → Run.
-- Requiere columnas de 20260609140000_user_shop_inventory.sql.
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
      'achievements', COALESCE(g.achievements, '{}'::jsonb),
      'equippedLogoId', g.equipped_logo_id
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
