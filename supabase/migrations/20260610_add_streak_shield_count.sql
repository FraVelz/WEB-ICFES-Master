-- Ejecutar en Supabase SQL Editor si la columna aún no existe.
alter table public.user_gamification
  add column if not exists streak_shield_count int not null default 0;

comment on column public.user_gamification.streak_shield_count is
  'Protectores de racha en inventario (máx. 3). Se consumen al fallar un día.';
