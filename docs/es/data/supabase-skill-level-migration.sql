-- Nivel de preparación autodeclarado (evaluación inicial)
-- Ejecutar en el SQL Editor de Supabase.

alter table users
  add column if not exists skill_level text
    check (skill_level in ('basics', 'intermediate', 'advanced')),
  add column if not exists level_assessment_completed_at timestamptz;
