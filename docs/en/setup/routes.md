# URLs

These are the project **URLs**. The public path `/aprendizaje` permanently redirects to **`/ruta-aprendizaje`** (see `next.config.ts`).

## Main pages

| URL                | Description             |
| ------------------ | ----------------------- |
| `/`                | Home                    |
| `/login`           | Sign in                 |
| `/signup`          | Registration            |
| `/onboarding`      | Initial onboarding      |
| `/forgot-password` | Password recovery       |
| `/reset-password`  | Reset password          |
| `/privacidad`      | Privacy policy          |
| `/terminos`        | Terms and conditions    |

## Dashboard (requires session or demo)

| URL                 | Description                   |
| ------------------- | ----------------------------- |
| `/ruta-aprendizaje` | Learning path (with AI chat)  |
| `/logros`           | Achievements and gamification |
| `/perfil`           | User profile                  |
| `/perfil/public`    | Public profile                |
| `/clasificatoria`   | Ranking / leaderboard         |
| `/desafios-diarios` | Daily challenges              |
| `/configuracion`    | Settings                      |
| `/examen-completo`  | Full simulation               |

## Practice (by area)

| URL                             | Description               |
| ------------------------------- | ------------------------- |
| `/practica/lectura-critica`     | Reading practice          |
| `/practica/matematicas`         | Math practice             |
| `/practica/ciencias-naturales`  | Natural sciences practice |
| `/practica/sociales-ciudadanas` | Social studies practice   |
| `/practica/ingles`              | English practice          |

## Lessons (by area and topic)

| URL                       | Example                                                             |
| ------------------------- | ------------------------------------------------------------------- |
| `/lessons/[area]/[topic]` | `/lessons/matematicas/algebra`, `/lessons/lenguaje/gramatica`, etc. |

**Areas and topics (examples):**

- **Mathematics:** algebra, geometria, calculo, trigonometria, numeros-complejos
- **Language:** gramatica, comprension, literatura, ortografia, semantica
- **Science:** biologia, fisica, quimica, ecologia, termodinamica
- **Social studies:** historia, geografia, economia, ciudadania, filosofia

## API

| URL         | Method | Description                                   |
| ----------- | ------ | --------------------------------------------- |
| `/api/chat` | POST   | AI model integration for the assistant       |

---
*AI-generated file. Last updated: Monday, May 18, 2026.*
