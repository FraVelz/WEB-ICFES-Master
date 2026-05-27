# Guía: lecciones por pasos (`lessons` + `steps`)

Documenta el flujo **Lesson Flow** usado en `/lessons/[area]/[topic]`. Complementa
[learning-structure-guide.md](./learning-structure-guide.md), que describe el **roadmap** (`learning_content`).

---

## Resolución en la ruta

En `src/app/(dashboard)/lessons/[area]/[topic]/page.tsx`:

1. **`getLessonWithSteps(area, topic)`** busca en Supabase slug `area/topic` en la tabla `lessons`.
2. Si hay filas en `steps`, renderiza **`LessonFlowClient`** (flujo por pasos).
3. Si no, cae en **`LessonPageClient`** → **`lessons-legacy/`** (contenido estático).

```txt
/lessons/matematicas/algebra
        ↓
  lessons.slug = "matematicas/algebra"
        ↓
  steps ordenados por order_index
        ↓
  LessonFlowClient | LegacyLessonLayout
```

---

## Tabla `lessons`

| Columna | Tipo | Descripción                                |
| ------- | ---- | ------------------------------------------ |
| `id`    | uuid | PK                                         |
| `title` | text | Título visible                             |
| `slug`  | text | Formato `area/topic` (coincide con la URL) |

Ejemplo: slug `matematicas/algebra` → URL `/lessons/matematicas/algebra/`.

Los pares válidos están en `LESSON_ROUTE_PAIRS` (`src/features/learning/constants/lessonDynamicRoutes.ts`).

---

## Tabla `steps`

| Columna       | Tipo  | Descripción                                       |
| ------------- | ----- | ------------------------------------------------- |
| `id`          | uuid  | PK                                                |
| `lesson_id`   | uuid  | FK → `lessons.id`                                 |
| `type`        | text  | `content` \| `quiz` \| `math_input` \| `resource` |
| `order_index` | int   | Orden ascendente                                  |
| `data`        | jsonb | Payload según `type`                              |

### Tipos de paso (`data`)

#### `content`

```json
{
  "title": "Introducción",
  "text": "Texto en Markdown o plano",
  "math": "x^2 + 1"
}
```

#### `quiz`

```json
{
  "question": "¿Cuál es la respuesta?",
  "options": ["A", "B", "C"],
  "correct": 1,
  "explanation": "Porque…",
  "mathExplanation": "x = 2"
}
```

#### `math_input`

```json
{
  "question": "Resuelve:",
  "answer": "42"
}
```

#### `resource`

```json
{
  "title": "Material PDF",
  "url": "https://…",
  "format": "pdf"
}
```

`format`: `pdf` | `link` | `video`.

---

## Slugs de área en URLs de lección

Las URLs `/lessons/...` usan segmentos distintos a la práctica o al roadmap:

| Roadmap / práctica    | Segmento en `/lessons/` |
| --------------------- | ----------------------- |
| `lectura-critica`     | `lenguaje`              |
| `matematicas`         | `matematicas`           |
| `ciencias-naturales`  | `ciencias`              |
| `sociales-ciudadanas` | `sociales`              |
| `ingles`              | `ingles`                |

Ver `ROADMAP_AREA_TO_LESSON_AREA` en `lessonDynamicRoutes.ts`.

---

## Código relacionado

| Archivo                                                  | Rol                          |
| -------------------------------------------------------- | ---------------------------- |
| `src/features/learning/server/getLessonWithSteps.ts`     | Lectura server-side Supabase |
| `src/features/learning/lesson-flow/LessonFlowClient.tsx` | Orquestación del flujo       |
| `src/features/learning/lesson-flow/renderLessonStep.tsx` | Render por tipo              |
| `src/features/learning/types/lessonFlow.ts`              | Tipos TypeScript             |

---

_Archivo generado por IA. Última actualización: miércoles, 27 de mayo de 2026._
