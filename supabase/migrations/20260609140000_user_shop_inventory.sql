-- Inventario de tienda y logo equipado (compartido entre web y app móvil).
-- Ejecutar en Supabase → SQL Editor → Run.
-- Orden: después de 20260609130000 (si aplica) y antes de 20260609141000.
ALTER TABLE public.user_gamification
  ADD COLUMN IF NOT EXISTS shop_inventory jsonb NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS equipped_logo_id text;

COMMENT ON COLUMN public.user_gamification.shop_inventory IS
  'IDs de ítems comprados en la tienda (p. ej. logo_nimbus, avatar_robot).';
COMMENT ON COLUMN public.user_gamification.equipped_logo_id IS
  'ID del logo de tienda equipado como avatar cuando no hay profile_image.';
