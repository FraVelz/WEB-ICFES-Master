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

| URL                  | Description                   |
| -------------------- | ----------------------------- |
| `/ruta-aprendizaje/` | Learning path (with AI chat)  |
| `/logros/`           | Achievements and gamification |
| `/perfil/`           | User profile                  |
| `/clasificatoria/`   | Ranking                       |
| `/desafios-diarios/` | Daily challenges              |
| `/configuracion/`    | Settings                      |
| `/examen-completo/`  | Full mock exam                |

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

## Lessons (by area and topic)

| URL                        | Example                                                         |
| -------------------------- | --------------------------------------------------------------- |
| `/lessons/[area]/[topic]/` | `/lessons/matematicas/algebra/`, `/lessons/lenguaje/gramatica/` |

### Slug mapping (practice/roadmap → lesson URL)

| App ID (practice, roadmap) | `/lessons/` segment |
| -------------------------- | ------------------- |
| `lectura-critica`          | `lenguaje`          |
| `matematicas`              | `matematicas`       |
| `ciencias-naturales`       | `ciencias`          |
| `sociales-ciudadanas`      | `sociales`          |
| `ingles`                   | `ingles`            |

**Topics (examples):**

- **Mathematics:** algebra, geometria, calculo, trigonometria, numeros-complejos
- **Language:** gramatica, comprension, literatura, ortografia, semantica
- **Sciences:** biologia, fisica, quimica, ecologia, termodinamica
- **Social:** historia, geografia, economia, ciudadania, filosofia
- **English:** gramatica, vocabulario, lectura, tiempos-verbales, conectores

See [lessons-steps-guide.md](../data/lessons-steps-guide.md) for the Supabase schema.

## API

| URL         | Method | Description       |
| ----------- | ------ | ----------------- |
| `/api/chat` | GET/POST | AI assistant chat |

Requires `OPENAI_API_KEY` on the server. Anonymous users have a limited quota (httpOnly cookie; constants in `src/features/learning/constants/chatAnonQuota.ts`). The client syncs the counter via `GET /api/chat`.

---

_Last updated: Wednesday, May 27, 2026._
