# Guía de Desarrollo

## Hook useQuizLogic

Ejemplo de uso del hook useQuizLogic con MATHEMATICS_QUESTIONS:

```javascript
import { useQuizLogic } from '../hooks/useQuizLogic';
import { MATHEMATICS_QUESTIONS } from '../data/questions';

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
      <button onClick={() => quiz.handleAnswer('A')}>Responder A</button>
      <button onClick={quiz.handleNextQuestion} disabled={!quiz.answered}>
        Siguiente
      </button>
    </div>
  );
}
```

## Crear Nuevo Componente Atómico

Ubicación: `src/components/atoms/AreaCard.jsx`

```javascript
import { Card } from './Card';
import { Title, Text } from './Text';
import { Badge } from './Badge';

export const AreaCard = ({ title, icon, description, questionsCount, onClick }) => {
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

## Agregar Nueva Área de Preguntas

Ubicación: `src/data/questions.js`

```javascript
export const NEW_AREA_QUESTIONS = [
  {
    id: 101,
    text: 'Pregunta de ejemplo',
    area: 'new_area',
    areaLabel: 'Nueva Área',
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

// Luego actualizar ALL_QUESTIONS
export const ALL_QUESTIONS = [
  ...MATHEMATICS_QUESTIONS,
  ...LANGUAGE_QUESTIONS,
  ...SCIENCE_QUESTIONS,
  ...SOCIAL_QUESTIONS,
  ...NEW_AREA_QUESTIONS,
];
```

## Funciones de Utilidad Disponibles

En `src/utils/quiz.js`:

- `calculateScore(results)` - Calcula el porcentaje
- `getAreaResults(results)` - Resultados por área
- `shuffleArray(array)` - Mezcla preguntas
- `getQuestionsByArea(questions, area)` - Filtra por área
- `getDifficultyStats(questions)` - Estadísticas de dificultad
- `ALL_QUESTIONS` - Importa todas las preguntas

## Estructura de una Pregunta

```javascript
{
  id: 1,                          // ID único
  text: "Pregunta aquí",          // Texto de la pregunta
  area: "mathematics",            // Área (matemáticas, lenguaje, science, social)
  areaLabel: "Matemáticas",       // Etiqueta legible del área
  difficulty: "fácil",            // Dificultad (fácil, medio, difícil)
  options: [                      // Array de 4 opciones
    { letter: "A", text: "Opción A" },
    { letter: "B", text: "Opción B" },
    { letter: "C", text: "Opción C" },
    { letter: "D", text: "Opción D" }
  ],
  correctAnswer: "B",             // Letra de la respuesta correcta
  explanation: "Porque..."        // Explicación de la respuesta
}
```

## Componentes Disponibles

### Atoms

- `Button` - Botones con variantes
- `Card` - Tarjetas contenedoras
- `Badge` - Etiquetas pequeñas
- `Input` - Campos de entrada
- `Text/Title` - Tipografía
- `Progress` - Barra de progreso

### Molecules

- `QuestionCard` - Tarjeta de pregunta
- `AnswerOption` - Opción de respuesta

### Organisms

- `QuestionPanel` - Panel completo de pregunta
- `ResultsPanel` - Panel de resultados
- `Header/Navigation` - Encabezados y navegación

### Pages

- `HomePage` - Página de inicio
- `PracticePage` - Página de práctica
- `FullExamPage` - Examen completo
- `LearningRoadmapPage` - Ruta de aprendizaje (`/ruta-aprendizaje`)
- `ProgressPage` - Seguimiento de progreso
