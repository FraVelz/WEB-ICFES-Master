# Frontend architecture (feature-based)

This project does **not** use Atomic Design as a folder layer. Organization is **by business domain**
(`src/features/`).

---

## Decision tree

1. **Single App Router route only?** → `src/app/.../_components/`.
2. **Single feature** (`auth`, `exam`, `learning`, `logros`, `store`, `user`, `home`)? →
   `src/features/<feature>/components/` (or `hooks/`, `utils/`, `data/` inside that feature).
3. **App-wide shell** (providers, guards, dashboard header)? → `src/components/`.
4. **UI reused in 2+ features** (Icon, Footer, alerts)? → `src/shared/components/`.
5. **Persistence or backend integrations?** → `src/services/` (`@/services/persistence`, etc.).
6. **Unsure?** → Start in the smallest scope. Promote to `shared/` only when a **second consumer** exists outside
   that feature.

---

## Recommended imports

```tsx
// ✅ Feature hook
import { useProgress } from '@/features/user/hooks/useProgress';

// ✅ Auth
import { useAuth } from '@/features/auth/context/AuthContext';

// ✅ Persistence
import { getProgress } from '@/services/persistence';

// ✅ Cross-feature UI
import { Icon } from '@/shared/components/Icon';

// ⚠️ Avoid global barrels except GSAP utilities
import { useGSAPReveal } from '@/hooks/useGSAPReveal';
```

The `@/hooks` barrel re-exports feature hooks for convenience, but **prefer direct imports** from the owning feature.

---

## Three different “store” names

| Path                  | Role                                                       |
| --------------------- | ---------------------------------------------------------- |
| `src/features/store/` | Shop UI (modals, item cards)                               |
| `src/services/store/` | Plan and subscription services (`SubscriptionPlanService`) |
| `src/store/`          | Redux: UI session (`uiSession`: demo, selected plan)       |

---

## Three lesson pipelines

| Pipeline    | Data                                         | Screen                              |
| ----------- | -------------------------------------------- | ----------------------------------- |
| Roadmap     | `learning_content` table + `LearningService` | `/ruta-aprendizaje`                 |
| Lesson flow | `lessons` + `steps` tables                   | `/lessons/[area]/[topic]`           |
| Legacy      | static `lessons-legacy/`                     | Fallback when Supabase has no steps |

See [learning-structure-guide.md](../data/learning-structure-guide.md) and
[lessons-steps-guide.md](../data/lessons-steps-guide.md).

---

## Area slug conventions

| Context                        | Example slug                                                |
| ------------------------------ | ----------------------------------------------------------- |
| Practice / roadmap / constants | `lectura-critica`, `matematicas`, `ciencias-naturales`      |
| `/lessons/...` URL             | `lenguaje`, `matematicas`, `ciencias`, `sociales`, `ingles` |
| `learning_content.area` column | `lectura_critica`, `matematicas`, `ciencias_naturales`      |

Mapping in code: `ROADMAP_AREA_TO_LESSON_AREA` in
`src/features/learning/constants/lessonDynamicRoutes.ts`.

---

_AI-generated file. Last updated: Wednesday, May 27, 2026._
