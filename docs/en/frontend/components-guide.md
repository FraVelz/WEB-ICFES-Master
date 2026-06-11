# Components guide

## `useExam` hook

Live quiz UI logic lives in **`PracticePage`** and **`FullExamPage`**. For persistence and attempt state use
**`useExam`** (`src/features/exam/hooks/useExam.ts`):

```typescript
import { useExam } from '@/features/exam/hooks/useExam';

export function ExamStatsExample() {
  const { attempts, loading, saveAttempt } = useExam();

  // attempts: local or Supabase history depending on account vs demo
  // saveAttempt(payload): stores a practice or full-exam attempt
}
```

Question types: `src/features/exam/types/question.ts`.

## Icons (`Icon`)

- Component: `@/shared/components/Icon` with `name`, `size`, `className`.
- Paths from [icons0](https://icons0.dev); registry under `src/shared/components/Icon/`.
- Dev gallery: `/dev/icons` — verify all icons in flex layouts before bulk changes.
- CI: `pnpm audit:icons` (registry, used names, Lucide fill misuse).

## Create a feature component (area card)

Generic atoms under `shared/atoms/` were removed. Add the component under the feature, e.g.
`src/features/exam/components/AreaHighlightCard.tsx`, using Tailwind and `Icon`:

```tsx
import { Icon } from '@/shared/components/Icon';
import { cn } from '@/utils/cn';

export function AreaHighlightCard({
  title,
  iconName,
  description,
  questionsCount,
  onClick,
  className,
}: {
  title: string;
  iconName: string;
  description: string;
  questionsCount: number;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'hover:border-app-ring/40 w-full rounded-xl border border-surface-border bg-surface-elevated/50 p-4 text-left',
        className
      )}
    >
      <div className="flex gap-4">
        <Icon name={iconName} className="text-app-accent text-3xl" />
        <div>
          <h3 className="font-bold text-white">{title}</h3>
          <p className="mt-1 text-sm text-on-surface-muted">{description}</p>
          <p className="text-app-accent mt-2 text-xs">{questionsCount} questions</p>
        </div>
      </div>
    </button>
  );
}
```

## Add questions for an area

Location: `src/features/exam/data/questions.ts`.

```typescript
export const NEW_AREA_QUESTIONS = [
  {
    id: 101,
    text: 'Sample question',
    area: 'new_area',
    areaLabel: 'New area',
    difficulty: 'easy',
    options: [
      { letter: 'A', text: 'Option 1' },
      { letter: 'B', text: 'Option 2' },
      { letter: 'C', text: 'Option 3' },
      { letter: 'D', text: 'Option 4' },
    ],
    correctAnswer: 'A',
    explanation: 'Why A is correct',
  },
];

// Then merge the block into the exported aggregate (e.g. ALL_QUESTIONS)
```

## Question shape (reference)

```typescript
{
  id: 1,
  text: 'Question text',
  area: 'mathematics',
  areaLabel: 'Mathematics',
  difficulty: 'easy',
  options: [
    { letter: 'A', text: 'Option A' },
    { letter: 'B', text: 'Option B' },
    { letter: 'C', text: 'Option C' },
    { letter: 'D', text: 'Option D' },
  ],
  correctAnswer: 'B',
  explanation: 'Because...',
}
```

## Avatars and images

- Profile / leaderboard: `AvatarImage` in `src/features/user/components/AvatarImage.tsx` (`next/image` wrapper).
- Mascot / shop: `next/image` with `fill` or fixed dimensions.
- Lesson markdown: `<img>` allowed only in the `LessonContentModal` renderer (dynamic URLs).

## Components (repo convention)

| Scope             | Components                              |
| ----------------- | --------------------------------------- |
| **shared/**       | `Icon`, `MascotaCircle`, `ModalOverlay` |
| **home/**         | `Footer` (landing)                      |
| **achievements/** | `AchievementsList`                      |
| **user/**         | `AvatarImage`, `ProfileComponents`      |
| **Global shell**  | `src/components/DashboardHeader/`       |

Cross-feature hooks: `src/hooks/gamification/` (`useGamification`, `useLeaderboard`). Achievement catalog:
`src/shared/constants/achievementsData.ts`.

Prefer direct feature imports (`@/features/user/hooks/useProgress`) over the removed global `@/hooks` barrel.

---

_AI-generated file. Last updated: Wednesday, May 27, 2026._
