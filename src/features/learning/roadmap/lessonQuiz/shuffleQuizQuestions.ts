import type { NormalizedQuizQuestion } from './quizTypes';

function shuffleArray<T>(items: T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/** Reordena opciones y reasigna ids a, b, c… manteniendo la respuesta correcta. */
export function shuffleQuestionOptions(question: NormalizedQuizQuestion): NormalizedQuizQuestion {
  if (question.options.length <= 1) return question;

  const correctOrigIndex = question.options.findIndex((opt) => opt.id === question.correctAnswer);
  const shuffledIndices = shuffleArray(question.options.map((_, index) => index));

  const options = shuffledIndices.map((origIndex, newIndex) => ({
    id: String.fromCharCode(97 + newIndex),
    text: question.options[origIndex].text,
  }));

  const newCorrectIndex = shuffledIndices.indexOf(correctOrigIndex >= 0 ? correctOrigIndex : 0);

  return {
    ...question,
    options,
    correctAnswer: options[newCorrectIndex]?.id ?? options[0]?.id ?? 'a',
  };
}

/** Mezcla el orden de las preguntas y las opciones de cada una. */
export function shuffleQuizQuestions(questions: NormalizedQuizQuestion[]): NormalizedQuizQuestion[] {
  return shuffleArray(questions).map(shuffleQuestionOptions);
}
