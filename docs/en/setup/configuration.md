# Configuration

Project configuration files.

---

## Environment variables

File: `.env.local` (not committed to git)

| Variable                        | Description                    | Required              |
| ------------------------------- | ------------------------------ | --------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`      | Supabase project URL           | Yes (supabase mode)   |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key         | Yes (supabase mode)   |
| `NEXT_PUBLIC_API_MODE`          | `supabase` or `localStorage`   | No (default: supabase)|
| `OPENAI_API_KEY`                | OpenAI key for chat assistant   | No                    |

---

## next.config.ts

- **output**: `'export'` for static build (optional)
- **images**: allowed domains for `next/image`
- **alias**: `@/` points to `src/`

---

## package.json

Main scripts:

| Script   | Command              | Use                  |
| -------- | -------------------- | -------------------- |
| `dev`    | `next dev`           | Local development    |
| `build`  | `next build`         | Production build     |
| `start`  | `next start`         | Production server    |
| `lint`   | `eslint .`           | Code review          |
| `format` | `prettier --write .` | Format code          |

---

## .gitignore

Includes: `node_modules/`, `.env.local`, `.env*.local`, `out/`, `.next/`
