# URLs

Estas son las **URLs** del proyecto.

## Convenciones

- **`trailingSlash: true`** — Todas las rutas llevan `/` final (p. ej. `/login/`, `/ruta-aprendizaje/`).
- **`/aprendizaje`** redirige de forma permanente a **`/ruta-aprendizaje/`** (ver `next.config.ts`).

## Páginas principales

| URL                 | Descripción             |
| ------------------- | ----------------------- |
| `/`                 | Inicio                  |
| `/login/`           | Iniciar sesión          |
| `/signup/`          | Registro                |
| `/onboarding/`      | Onboarding inicial      |
| `/forgot-password/` | Recuperar contraseña    |
| `/reset-password/`  | Restablecer contraseña  |
| `/auth/callback/`   | Callback OAuth (Google) |
| `/privacidad/`      | Política de privacidad  |
| `/terminos/`        | Términos y condiciones  |

## Evaluación de nivel inicial (obligatoria)

| URL                  | Descripción                                      |
| -------------------- | ------------------------------------------------ |
| `/evaluacion-nivel/` | Cuestionario corto para personalizar la ruta     |

Tras entrar en **modo demo** o crear/iniciar sesión, `LevelAssessmentGate` (`src/components/LevelAssessmentGate.tsx`) redirige al dashboard solo cuando el usuario completó esta evaluación para su ámbito (demo o cuenta). Es intencional: fija el nivel inicial de la ruta de aprendizaje y evita recomendaciones genéricas.

- La ruta tiene `robots: noindex` y no está en el sitemap.
- Si en el futuro se relaja el flujo, las opciones habituales son «evaluar más tarde» (snooze) o un banner en el dashboard en lugar de redirección forzada.

## Dashboard (requiere sesión o demo)

| URL                  | Descripción                       |
| -------------------- | --------------------------------- |
| `/ruta-aprendizaje/` | Ruta de aprendizaje (con chat IA) |
| `/logros/`           | Logros y gamificación             |
| `/perfil/`           | Perfil del usuario                |
| `/ligas/`   | Ligas semanales y ranking           |
| `/configuracion/`    | Configuración                     |
| `/examen-completo/`  | Simulacro completo                |
| `/ruta-al-500/`      | Ruta pedagógica al puntaje 500    |
| `/lectura/`          | Material informativo ICFES        |
| `/importancia/`      | Importancia del bachiller         |
| `/informacion/`      | Infografías y enlaces oficiales   |
| `/consejos/`         | Consejos de estudio y examen      |
| `/fases/`            | Fases de competencias por área    |

## Perfil público (sin layout de auth)

| URL               | Descripción                                      |
| ----------------- | ------------------------------------------------ |
| `/perfil/public/` | Perfil público (`?userId=`). Fuera de `(auth)/`. |

## Práctica (por área)

Slugs alineados con `AREA_INFO` en `src/shared/constants/areaInfo.ts`:

| URL                              | Descripción                    |
| -------------------------------- | ------------------------------ |
| `/practica/lectura-critica/`     | Práctica Lectura Crítica       |
| `/practica/matematicas/`         | Práctica Matemáticas           |
| `/practica/ciencias-naturales/`  | Práctica Ciencias Naturales    |
| `/practica/sociales-ciudadanas/` | Práctica Sociales y Ciudadanas |
| `/practica/ingles/`              | Práctica Inglés                |

## API

| URL         | Método   | Descripción                             |
| ----------- | -------- | --------------------------------------- |
| `/api/chat` | GET/POST | Chat con modelo de IA para el asistente |

Requiere `OPENAI_API_KEY` en el servidor. Usuarios anónimos tienen cuota limitada (cookie httpOnly; constantes en `src/features/learning/constants/chatAnonQuota.ts`). El cliente sincroniza el contador con `GET /api/chat`.

---

_Última actualización: miércoles, 27 de mayo de 2026._
