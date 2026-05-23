# Components guide

## `useQuizLogic` hook

Example with `MATHEMATICS_QUESTIONS` (defined in `src/shared/data/questions.ts`):

```typescript
import { useQuizLogic } from '@/features/exam/hooks/useQuizLogic';
import { MATHEMATICS_QUESTIONS } from '@/shared/data/questions';

export function QuizExample() {
  const quiz = useQuizLogic(MATHEMATICS_QUESTIONS);

  // Available properties:
  // - currentQuestion: Current question
  // - currentQuestionIndex: Question index
  // - answered: Whether the question has been answered
  // - showExplanation: Whether to show the explanation
  // - isFinished: Whether the quiz has finished
  // - progress: Current progress (question number)
  // - totalQuestions: Total questions
  // - handleAnswer(selectedAnswer): Register answer
  // - handleNextQuestion(): Go to next
  // - handlePreviousQuestion(): Go to previous
  // - getResults(): Get results
  // - reset(): Reset quiz

  return (
    <div>
      <p>
        {quiz.progress} / {quiz.totalQuestions}
      </p>
      <h2>{quiz.currentQuestion.text}</h2>
      <button type="button" onClick={() => quiz.handleAnswer('A')}>
        Answer A
      </button>
      <button type="button" onClick={quiz.handleNextQuestion} disabled={!quiz.answered}>
        Next
      </button>
    </div>
  );
}
```

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
        'hover:border-app-ring/40 w-full rounded-xl border border-slate-700 bg-slate-900/50 p-4 text-left',
        className
      )}
    >
      <div className="flex gap-4">
        <Icon name={iconName} className="text-app-accent text-3xl" />
        <div>
          <h3 className="font-bold text-white">{title}</h3>
          <p className="mt-1 text-sm text-slate-400">{description}</p>
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
    explanation: 'Explanation of why A is correct',
  },
];

// Then include the block in the exported aggregate (e.g. ALL_QUESTIONS)
```

## Quiz logic

Use `src/features/exam/hooks/useQuizLogic.ts` and types in `src/features/exam/types/question.ts`.

- `calculateScore(results)` — percentage
- `getAreaResults(results)` — per-area results
- `shuffleArray(array)` — shuffle questions
- `getQuestionsByArea(questions, area)` — filter by area
- `getDifficultyStats(questions)` — difficulty stats

## Question shape (reference)

```typescript
{
  id: 1,
  text: 'Question here',
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

## Components (repo convention)

Shared UI: **`Icon`**, **`Footer`**, **`MascotaCircle`**, **`ConstructionAlert`**. Dashboard nav:
**`src/components/DashboardHeader.tsx`**. Exam domain: `AnswerOption` in `features/exam/components/`. Features under
`src/features/*`; routes in `src/app/`.

---

_AI-generated file. Last updated: Monday, May 18, 2026._
