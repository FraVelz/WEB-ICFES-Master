# Development Guide

## useQuizLogic Hook

Example usage of the useQuizLogic hook with MATHEMATICS_QUESTIONS:

```javascript
import { useQuizLogic } from '../hooks/useQuizLogic';
import { MATHEMATICS_QUESTIONS } from '../data/questions';

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
      <button onClick={() => quiz.handleAnswer('A')}>Answer A</button>
      <button onClick={quiz.handleNextQuestion} disabled={!quiz.answered}>
        Next
      </button>
    </div>
  );
}
```

## Create New Atomic Component

Location: `src/components/atoms/AreaCard.tsx`

```typescript
import { Card } from './Card';
import { Title, Text } from './Text';
import { Badge } from './Badge';

export const AreaCard = ({
  title,
  icon,
  description,
  questionsCount,
  onClick
}) => {
  return (
    <Card hover onClick={onClick}>
      <div className="flex items-start gap-4">
        <div className="text-4xl">{icon}</div>
        <div className="flex-1">
          <Title level={4}>{title}</Title>
          <Text variant="small" className="mt-2">{description}</Text>
          <Badge variant="default" className="mt-3">
            {questionsCount} questions
          </Badge>
        </div>
      </div>
    </Card>
  );
};
```

## Add New Question Area

Location: `src/data/questions.ts`

```typescript
export const NEW_AREA_QUESTIONS = [
  {
    id: 101,
    text: 'Sample question',
    area: 'new_area',
    areaLabel: 'New Area',
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

// Then update ALL_QUESTIONS
export const ALL_QUESTIONS = [
  ...MATHEMATICS_QUESTIONS,
  ...LANGUAGE_QUESTIONS,
  ...SCIENCE_QUESTIONS,
  ...SOCIAL_QUESTIONS,
  ...NEW_AREA_QUESTIONS,
];
```

## Available Utility Functions

In `src/utils/quiz.ts`:

- `calculateScore(results)` - Calculates percentage
- `getAreaResults(results)` - Results by area
- `shuffleArray(array)` - Shuffles questions
- `getQuestionsByArea(questions, area)` - Filter by area
- `getDifficultyStats(questions)` - Difficulty statistics
- `ALL_QUESTIONS` - Imports all questions

## Question Structure

```typescript
{
  id: 1,                          // Unique ID
  text: "Question here",          // Question text
  area: "mathematics",            // Area (mathematics, language, science, social)
  areaLabel: "Mathematics",       // Readable area label
  difficulty: "easy",             // Difficulty (easy, medium, hard)
  options: [                      // Array of 4 options
    { letter: "A", text: "Option A" },
    { letter: "B", text: "Option B" },
    { letter: "C", text: "Option C" },
    { letter: "D", text: "Option D" }
  ],
  correctAnswer: "B",             // Letter of correct answer
  explanation: "Because..."       // Answer explanation
}
```

## Available Components

### Atoms

- `Button` - Buttons with variants
- `Card` - Container cards
- `Badge` - Small labels
- `Input` - Input fields
- `Text/Title` - Typography
- `Progress` - Progress bar

### Molecules

- `QuestionCard` - Question card
- `AnswerOption` - Answer option

### Organisms

- `QuestionPanel` - Full question panel
- `ResultsPanel` - Results panel
- `Header/Navigation` - Headers and navigation

### Pages

- `HomePage` - Home page
- `PracticePage` - Practice page
- `FullExamPage` - Full exam
- `LearningPage` - Study material
- `ProgressPage` - Progress tracking
