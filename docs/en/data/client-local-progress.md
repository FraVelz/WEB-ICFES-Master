# Client-only progress (localStorage)

Where progress lives that is **not** automatically synced with Supabase or another backend.

## Canonical module

- **Feature API:** import from `@/services/persistence` (`savePractice`, `getProgress`, etc.).
- **Internal implementation:** [`src/storage/progressStorage.ts`](../../../src/storage/progressStorage.ts)
- Environment: **browser only** (`localStorage`). Do not use in Server Components without a `typeof window` guard.

## Storage keys

| Key                       | Short description                                         |
| ------------------------- | --------------------------------------------------------- |
| `icfes_exams`             | Full exam attempts (`saveFullExam`)                       |
| `icfes_practice`          | Area practice attempts (`savePractice`)                   |
| `icfes_progress`          | Derived aggregate (percentages, areas, streak, etc.)      |
| `icfes_completed_lessons` | Completed lesson IDs (`LearningService` / local progress) |
| `icfes_streak_dates`      | Demo/anonymous streak: JSON `{ dates, longestStreak }` or legacy date array |
| `icfes_streak_dates_{uid}` | Authenticated user streak (same format)                  |
| `icfes_active_streak_user` | Active UID for streak writes outside React (exams/practice) |

## Daily streak

- **Service:** [`src/services/streak/`](../../../src/services/streak/)
- **Demo:** scope `'demo'` → key `icfes_streak_dates`
- **User:** scope `userId` → key `icfes_streak_dates_{userId}` + Supabase columns `streak_dates` / `longest_streak` on `user_gamification` (see [`supabase-streak-migration.sql`](../../es/data/supabase-streak-migration.sql))
- **Recording:** visit to `/ruta-aprendizaje` (once/day), practice, or full exam
- **Demo → account:** on signup/login, `mergeDemoStreakIntoUser` merges demo dates into the user and clears the demo key

## Relation to other data

- **Gamification** (achievements, levels with hybrid persistence) may use
  [`src/services/persistence/gamificationPersistence.ts`](../../../src/services/persistence/gamificationPersistence.ts)
  and Supabase depending on configuration.
- Learning paths backed by **Supabase** do not replace these keys: locally completed lessons remain separate until
  persistence is unified.

Treat this module and its callers as the source of truth for local storage behavior.

---

_AI-generated file. Last updated: Monday, May 18, 2026._
