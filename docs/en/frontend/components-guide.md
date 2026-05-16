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

## Example area highlight card (atomic pattern)

Illustrative example using existing atoms under `src/shared/components/atoms/` (e.g. `Card`, `Badge`, `Text`). Add a new file such as `src/shared/components/atoms/AreaHighlightCard.tsx`:

```tsx
import { Card } from '@/shared/components/atoms/Card';
import { Title, Text } from '@/shared/components/atoms/Text';
import { Badge } from '@/shared/components/atoms/Badge';

export const AreaHighlightCard = ({
  title,
  icon,
  description,
  questionsCount,
  onClick,
}: {
  title: string;
  icon: React.ReactNode;
  description: string;
  questionsCount: number;
  onClick?: () => void;
}) => {
  return (
    <Card hover onClick={onClick}>
      <div className="flex items-start gap-4">
        <div className="text-4xl">{icon}</div>
        <div className="flex-1">
          <Title level={4}>{title}</Title>
          <Text variant="small" className="mt-2">
            {description}
          </Text>
          <Badge variant="default" className="mt-3">
            {questionsCount} questions
          </Badge>
        </div>
      </div>
    </Card>
  );
};
```

## Add questions for an area

Location: `src/shared/data/questions.ts`.

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

## Quiz utilities

In `src/shared/utils/quiz.ts`:

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

Primitives live under **`src/shared/components/atoms/`**. Larger compositions usually sit in `molecules/` and `organisms/` under `src/shared/components/`. Feature pages are wired from `src/features/*` and routes from `src/app/`.

---
*AI-generated file. Last updated: Saturday, May 16, 2026.*
