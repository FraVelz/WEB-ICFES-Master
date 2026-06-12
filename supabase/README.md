# Supabase — migraciones y RLS

Este directorio versiona el esquema SQL del proyecto Supabase compartido por **WEB-ICFES-Master**, **WEB-ICFES-Admin** y **app-icfes-master**.

## Estado actual

Las políticas RLS y migraciones viven hoy en el panel de Supabase (remoto). Este repo incluye la carpeta como punto de partida para versionar cambios.

## Checklist RLS

Antes de desplegar cambios de esquema, verifica las políticas documentadas en:

- [`docs/es/backend/services-api.md`](../docs/es/backend/services-api.md) — sección **Checklist RLS (Supabase)**

Tablas críticas: `users`, `user_gamification`, `learning_content`, `exam_questions`, `profile_reports`.

## Flujo recomendado

1. Crear migración en `supabase/migrations/` con timestamp: `YYYYMMDDHHMMSS_descripcion.sql`
2. Aplicar en staging con `supabase db push` o el SQL Editor
3. Validar con la app cliente (anon key) que no hay lectura/escritura indebida
4. Aplicar en producción y ejecutar `NOTIFY pgrst, 'reload schema'` si PostgREST no refleja cambios

## Enlaces

- [Supabase CLI — local development](https://supabase.com/docs/guides/local-development)
- [Row Level Security](https://supabase.com/docs/guides/database/postgres/row-level-security)
