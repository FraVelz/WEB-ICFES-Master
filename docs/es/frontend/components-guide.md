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

## Crear un componente de feature (tarjeta de área)

Los átomos genéricos en `shared/atoms/` se eliminaron. Crea el componente en la feature, p. ej.
`src/features/exam/components/AreaHighlightCard.tsx`, con Tailwind y `Icon`:

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
          <p className="text-app-accent mt-2 text-xs">{questionsCount} preguntas</p>
        </div>
      </div>
    </button>
  );
}
```

## Añadir preguntas de un área

Ubicación: `src/features/exam/data/questions.ts`.

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

## Lógica de quiz

Usa `src/features/exam/hooks/useQuizLogic.ts` y tipos en `src/features/exam/types/question.ts`.

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

UI compartida: **`Icon`**, **`Footer`**, **`MascotaCircle`**, **`ConstructionAlert`**. Navegación del dashboard:
**`src/components/DashboardHeader.tsx`**. Dominio examen: `AnswerOption` en `features/exam/components/`. Features en
`src/features/*`; rutas en `src/app/`.

---

_Archivo generado por IA. Última actualización: lunes, 18 de mayo de 2026._
