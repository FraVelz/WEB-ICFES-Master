# URLs

These are the application **URLs**.

## Conventions

- **`trailingSlash: true`** — All routes end with `/` (e.g. `/login/`, `/ruta-aprendizaje/`).
- **`/aprendizaje`** permanently redirects to **`/ruta-aprendizaje/`** (see `next.config.ts`).

## Main pages

| URL                 | Description             |
| ------------------- | ----------------------- |
| `/`                 | Home                    |
| `/login/`           | Sign in                 |
| `/signup/`          | Sign up                 |
| `/onboarding/`      | Initial onboarding      |
| `/forgot-password/` | Password recovery       |
| `/reset-password/`  | Reset password          |
| `/auth/callback/`   | OAuth callback (Google) |
| `/privacidad/`      | Privacy policy          |
| `/terminos/`        | Terms and conditions    |

## Dashboard (requires session or demo)

| URL                  | Description                     |
| -------------------- | ------------------------------- |
| `/ruta-aprendizaje/` | Learning path (with AI chat)    |
| `/logros/`           | Achievements and gamification   |
| `/perfil/`           | User profile                    |
| `/ligas/`   | Weekly leagues and ranking      |
| `/configuracion/`    | Settings                        |
| `/examen-completo/`  | Full mock exam                  |
| `/ruta-al-500/`      | Route to 500 — learning journey |
| `/lectura/`          | ICFES informational content     |
| `/importancia/`      | Importance of high school       |
| `/informacion/`      | Official infographics and links |
| `/consejos/`         | Study and exam tips             |
| `/fases/`            | Competency phases by area       |

## Public profile (no auth layout)

| URL               | Description                                     |
| ----------------- | ----------------------------------------------- |
| `/perfil/public/` | Public profile (`?userId=`). Outside `(auth)/`. |

## Practice (by area)

Slugs aligned with `AREA_INFO` in `src/shared/constants/areaInfo.ts`:

| URL                              | Description               |
| -------------------------------- | ------------------------- |
| `/practica/lectura-critica/`     | Critical Reading practice |
| `/practica/matematicas/`         | Mathematics practice      |
| `/practica/ciencias-naturales/`  | Natural Sciences practice |
| `/practica/sociales-ciudadanas/` | Social Studies practice   |
| `/practica/ingles/`              | English practice          |

## API

| URL         | Method   | Description       |
| ----------- | -------- | ----------------- |
| `/api/chat` | GET/POST | AI assistant chat |

Requires `OPENAI_API_KEY` on the server. Anonymous users have a limited quota (httpOnly cookie; constants in `src/features/learning/constants/chatAnonQuota.ts`). The client syncs the counter via `GET /api/chat`.

---

_Last updated: Wednesday, May 27, 2026._
