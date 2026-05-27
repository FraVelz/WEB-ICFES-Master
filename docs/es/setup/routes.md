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

## Dashboard (requiere sesión o demo)

| URL                  | Descripción                       |
| -------------------- | --------------------------------- |
| `/ruta-aprendizaje/` | Ruta de aprendizaje (con chat IA) |
| `/logros/`           | Logros y gamificación             |
| `/perfil/`           | Perfil del usuario                |
| `/clasificatoria/`   | Clasificación / ranking           |
| `/desafios-diarios/` | Desafíos diarios                  |
| `/configuracion/`    | Configuración                     |
| `/examen-completo/`  | Simulacro completo                |

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

## Lecciones (por área y tema)

| URL                        | Ejemplo                                                         |
| -------------------------- | --------------------------------------------------------------- |
| `/lessons/[area]/[topic]/` | `/lessons/matematicas/algebra/`, `/lessons/lenguaje/gramatica/` |

### Mapeo de slugs (práctica/roadmap → URL de lección)

| ID en app (práctica, roadmap) | Segmento en `/lessons/` |
| ----------------------------- | ----------------------- |
| `lectura-critica`             | `lenguaje`              |
| `matematicas`                 | `matematicas`           |
| `ciencias-naturales`          | `ciencias`              |
| `sociales-ciudadanas`         | `sociales`              |
| `ingles`                      | `ingles`                |

**Temas (ejemplos):**

- **Matemáticas:** algebra, geometria, calculo, trigonometria, numeros-complejos
- **Lenguaje:** gramatica, comprension, literatura, ortografia, semantica
- **Ciencias:** biologia, fisica, quimica, ecologia, termodinamica
- **Sociales:** historia, geografia, economia, ciudadania, filosofia
- **Inglés:** gramatica, vocabulario, lectura, tiempos-verbales, conectores

Ver [lessons-steps-guide.md](../data/lessons-steps-guide.md) para el esquema Supabase.

## API

| URL         | Método | Descripción                             |
| ----------- | ------ | --------------------------------------- |
| `/api/chat` | POST   | Chat con modelo de IA para el asistente |

Requiere `OPENAI_API_KEY` en el servidor. Usuarios anónimos tienen cuota limitada (`src/utils/chatAnonQuota.ts`).

---

_Última actualización: miércoles, 27 de mayo de 2026._
