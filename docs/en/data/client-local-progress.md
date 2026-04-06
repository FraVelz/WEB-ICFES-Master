# Client-only progress (localStorage)

Where progress lives that is **not** automatically synced with Supabase or another backend.

## Canonical module

- Implementation: [`src/shared/utils/progressStorage.ts`](../../../src/shared/utils/progressStorage.ts)
- Environment: **browser only** (`localStorage`). Do not use in Server Components without a `typeof window` guard.

## Storage keys

| Key                       | Short description                                              |
| ------------------------- | -------------------------------------------------------------- |
| `icfes_exams`             | Full exam attempts (`saveFullExam`)                            |
| `icfes_practice`          | Area practice attempts (`savePractice`)                        |
| `icfes_progress`          | Derived aggregate (percentages, areas, streak, etc.)           |
| `icfes_completed_lessons` | Completed lesson IDs (`LearningService` / local progress)      |

## Relation to other data

- **Gamification** (achievements, levels with hybrid persistence) may use [`src/services/persistence/gamificationPersistence.ts`](../../../src/services/persistence/gamificationPersistence.ts) and Supabase depending on configuration.
- Learning paths backed by **Supabase** do not replace these keys: locally completed lessons remain separate until persistence is unified.

Treat this module and its callers as the source of truth for local storage behavior.
