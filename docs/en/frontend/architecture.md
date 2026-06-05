# Frontend architecture (feature-based)

This project does **not** use Atomic Design as a folder layer. Organization is **by business domain**
(`src/features/`).

---

## Decision tree

1. **Single App Router route only?** → `src/app/.../_components/` (or co-located next to `page.tsx` for small route-only pieces).
2. **Single feature** (`auth`, `exam`, `learning`, `achievements`, `store`, `user`, `home`)? →
   `src/features/<feature>/components/` (or `hooks/`, `context/`, `utils/`, `data/` inside that feature).
3. **App-wide shell** (providers, guards, dashboard header)? → `src/components/`.
4. **UI reused in 2+ features** (Icon, alerts)? → `src/shared/components/`.
5. **Domain hooks used in 2+ features** (gamification)? → `src/hooks/gamification/`.
6. **Persistence or backend integrations?** → `src/services/` (`@/services/persistence`, etc.).
7. **Global UI state** (demo mode)? → `src/store/` (`demoMode.ts`, Redux `uiSession`).
8. **Unsure?** → Start in the smallest scope. Promote to `shared/` only when a **second consumer** exists outside
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

// ✅ Cross-feature gamification
import { useGamification } from '@/hooks/gamification';

// ✅ Practice slugs / ranks
import { PRACTICA_AREA_SLUGS } from '@/shared/constants/practiceAreas';
import { RANKS } from '@/shared/constants/ranks';

// ✅ Cross-feature UI
import { Icon } from '@/shared/components/Icon';

// ⚠️ Avoid global barrels except GSAP utilities
import { useGSAPReveal } from '@/hooks/useGSAPReveal';
```

The `@/hooks` barrel re-exports feature hooks for convenience, but **prefer direct imports** from the owning feature
(e.g. `@/features/auth/utils/mapSupabaseAuthError`, not shims under `@/utils/`).

---

## Supabase (`src/config/`)

| Import                    | When to use                                                               |
| ------------------------- | ------------------------------------------------------------------------- |
| `@/config/supabase`       | Browser client (`supabase` singleton) and client-side services            |
| `@/config/supabaseClient` | Route Handlers, Server Components, scripts (`createServerSupabaseClient`) |

---

## URL vs code convention

| Public URL | Feature in code              |
| ---------- | ---------------------------- |
| `/logros/` | `src/features/achievements/` |

---

## Three different “store” names

| Path                  | Role                                                       |
| --------------------- | ---------------------------------------------------------- |
| `src/features/store/` | Shop UI (modals, item cards)                               |
| `src/services/store/` | Plan and subscription services (`SubscriptionPlanService`) |
| `src/store/`          | Redux: UI session (`uiSession`: demo, selected plan)       |

---

## Learning pipeline

| Pipeline | Data                                         | Screen              |
| -------- | -------------------------------------------- | ------------------- |
| Roadmap  | `learning_content` table + `LearningService` | `/ruta-aprendizaje` |

See [learning-structure-guide.md](../data/learning-structure-guide.md).

---

## Area slug conventions

| Context                        | Example slug                                                |
| ------------------------------ | ----------------------------------------------------------- |
| Practice / roadmap / constants | `lectura-critica`, `matematicas`, `ciencias-naturales`      |
| `learning_content.area` column | `lectura_critica`, `matematicas`, `ciencias_naturales`      |

Mapping in code: `ROADMAP_AREA_TO_LESSON_AREA` in
`src/features/learning/constants/lessonRoutes.ts`.

---

_AI-generated file. Last updated: Wednesday, May 27, 2026._
