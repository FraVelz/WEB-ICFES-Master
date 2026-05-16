# Guía de componentes

## Hook `useQuizLogic`

Ejemplo con `MATHEMATICS_QUESTIONS` (definidas en `src/shared/data/questions.ts`):

```typescript
import { useQuizLogic } from '@/features/exam/hooks/useQuizLogic';
import { MATHEMATICS_QUESTIONS } from '@/shared/data/questions';

export function QuizExample() {
  const quiz = useQuizLogic(MATHEMATICS_QUESTIONS);

  // Propiedades disponibles:
  // - currentQuestion: Pregunta actual
  // - currentQuestionIndex: Índice de la pregunta
  // - answered: Si la pregunta ha sido respondida
  // - showExplanation: Si mostrar la explicación
  // - isFinished: Si el quiz ha finalizado
  // - progress: Progreso actual (número de pregunta)
  // - totalQuestions: Total de preguntas
  // - handleAnswer(selectedAnswer): Registrar respuesta
  // - handleNextQuestion(): Ir a la siguiente
  // - handlePreviousQuestion(): Ir a la anterior
  // - getResults(): Obtener resultados
  // - reset(): Reiniciar el quiz

  return (
    <div>
      <p>
        {quiz.progress} / {quiz.totalQuestions}
      </p>
      <h2>{quiz.currentQuestion.text}</h2>
      <button type="button" onClick={() => quiz.handleAnswer('A')}>
        Responder A
      </button>
      <button type="button" onClick={quiz.handleNextQuestion} disabled={!quiz.answered}>
        Siguiente
      </button>
    </div>
  );
}
```

## Crear un ejemplo de átomo compuesto (tarjeta de área)

Ejemplo ilustrativo siguiendo átomos existentes en `src/shared/components/atoms/` (p. ej. `Card`, `Badge`, `Text`). Crea un archivo nuevo como `src/shared/components/atoms/AreaHighlightCard.tsx`:

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
            {questionsCount} preguntas
          </Badge>
        </div>
      </div>
    </Card>
  );
};
```

## Añadir preguntas de un área

Ubicación: `src/shared/data/questions.ts`.

```typescript
export const NEW_AREA_QUESTIONS = [
  {
    id: 101,
    text: 'Pregunta de ejemplo',
    area: 'new_area',
    areaLabel: 'Nueva área',
    difficulty: 'fácil',
    options: [
      { letter: 'A', text: 'Opción 1' },
      { letter: 'B', text: 'Opción 2' },
      { letter: 'C', text: 'Opción 3' },
      { letter: 'D', text: 'Opción 4' },
    ],
    correctAnswer: 'A',
    explanation: 'Explicación de por qué A es correcta',
  },
];

// Luego incorporar el bloque en el agregado exportado (p. ej. ALL_QUESTIONS)
```

## Utilidades de quiz

En `src/shared/utils/quiz.ts`:

- `calculateScore(results)` — calcula el porcentaje
- `getAreaResults(results)` — resultados por área
- `shuffleArray(array)` — mezcla preguntas
- `getQuestionsByArea(questions, area)` — filtra por área
- `getDifficultyStats(questions)` — estadísticas de dificultad

## Estructura de una pregunta (referencia)

```typescript
{
  id: 1,
  text: 'Pregunta aquí',
  area: 'mathematics',
  areaLabel: 'Matemáticas',
  difficulty: 'fácil',
  options: [
    { letter: 'A', text: 'Opción A' },
    { letter: 'B', text: 'Opción B' },
    { letter: 'C', text: 'Opción C' },
    { letter: 'D', text: 'Opción D' },
  ],
  correctAnswer: 'B',
  explanation: 'Porque...',
}
```

## Componentes (convención del repo)

Los primitivos viven en **`src/shared/components/atoms/`**. Composiciones mayores suelen estar en `molecules/` y `organisms/` bajo `src/shared/components/`. Las páginas de feature se integran desde `src/features/*` y las rutas en `src/app/`.

---
*Archivo generado por IA. Última actualización: sábado, 16 de mayo de 2026.*
