# Configuración

Archivos de configuración del proyecto.

---

## Variables de entorno

Archivo: `.env.local` (no se sube a git)

| Variable                        | Descripción                      | Obligatorio            |
| ------------------------------- | -------------------------------- | ---------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`      | URL del proyecto Supabase        | Sí (modo supabase)     |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Clave anónima de Supabase        | Sí (modo supabase)     |
| `NEXT_PUBLIC_API_MODE`          | `supabase` o `localStorage`      | No (default: supabase) |
| `OPENAI_API_KEY`                | Clave OpenAI para chat asistente | No                     |

---

## next.config.ts

- **output**: `'export'` para build estático (opcional)
- **images**: dominios permitidos para `next/image`
- **alias**: `@/` apunta a `src/`

---

## package.json

Scripts principales:

| Script   | Comando              | Uso                 |
| -------- | -------------------- | ------------------- |
| `dev`    | `next dev`           | Desarrollo local    |
| `build`  | `next build`         | Compilar producción |
| `start`  | `next start`         | Servidor producción |
| `lint`   | `eslint .`           | Revisar código      |
| `format` | `prettier --write .` | Formatear código    |

---

## .gitignore

Incluye: `node_modules/`, `.env.local`, `.env*.local`, `out/`, `.next/`
