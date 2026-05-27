# Guide: step-based lessons (`lessons` + `steps`)

Documents the **Lesson Flow** pipeline used at `/lessons/[area]/[topic]`. Complements
[learning-structure-guide.md](./learning-structure-guide.md), which covers the **roadmap** (`learning_content`).

---

## Route resolution

In `src/app/(dashboard)/lessons/[area]/[topic]/page.tsx`:

1. **`getLessonWithSteps(area, topic)`** looks up Supabase slug `area/topic` in the `lessons` table.
2. If `steps` rows exist, renders **`LessonFlowClient`** (step-based flow).
3. Otherwise falls back to **`LessonPageClient`** → **`lessons-legacy/`** (static content).

```txt
/lessons/matematicas/algebra
        ↓
  lessons.slug = "matematicas/algebra"
        ↓
  steps ordered by order_index
        ↓
  LessonFlowClient | LegacyLessonLayout
```

---

## `lessons` table

| Column  | Type | Description                       |
| ------- | ---- | --------------------------------- |
| `id`    | uuid | PK                                |
| `title` | text | Visible title                     |
| `slug`  | text | Format `area/topic` (matches URL) |

Example: slug `matematicas/algebra` → URL `/lessons/matematicas/algebra/`.

Valid pairs are listed in `LESSON_ROUTE_PAIRS` (`src/features/learning/constants/lessonRoutes.ts`).

---

## `steps` table

| Column        | Type  | Description                                       |
| ------------- | ----- | ------------------------------------------------- |
| `id`          | uuid  | PK                                                |
| `lesson_id`   | uuid  | FK → `lessons.id`                                 |
| `type`        | text  | `content` \| `quiz` \| `math_input` \| `resource` |
| `order_index` | int   | Ascending order                                   |
| `data`        | jsonb | Payload by `type`                                 |

### Step types (`data`)

#### `content`

```json
{
  "title": "Introduction",
  "text": "Markdown or plain text",
  "math": "x^2 + 1"
}
```

#### `quiz`

```json
{
  "question": "What is the answer?",
  "options": ["A", "B", "C"],
  "correct": 1,
  "explanation": "Because…",
  "mathExplanation": "x = 2"
}
```

#### `math_input`

```json
{
  "question": "Solve:",
  "answer": "42"
}
```

#### `resource`

```json
{
  "title": "PDF material",
  "url": "https://…",
  "format": "pdf"
}
```

`format`: `pdf` | `link` | `video`.

---

## Area slugs in lesson URLs

`/lessons/...` URL segments differ from practice or roadmap IDs:

| Roadmap / practice    | `/lessons/` segment |
| --------------------- | ------------------- |
| `lectura-critica`     | `lenguaje`          |
| `matematicas`         | `matematicas`       |
| `ciencias-naturales`  | `ciencias`          |
| `sociales-ciudadanas` | `sociales`          |
| `ingles`              | `ingles`            |

See `ROADMAP_AREA_TO_LESSON_AREA` in `lessonRoutes.ts`.

---

## Related code

| File                                                     | Role                      |
| -------------------------------------------------------- | ------------------------- |
| `src/features/learning/server/getLessonWithSteps.ts`     | Server-side Supabase read |
| `src/features/learning/lesson-flow/LessonFlowClient.tsx` | Flow orchestration        |
| `src/features/learning/lesson-flow/renderLessonStep.tsx` | Render by type            |
| `src/features/learning/types/lessonFlow.ts`              | TypeScript types          |

---

_AI-generated file. Last updated: Wednesday, May 27, 2026._
