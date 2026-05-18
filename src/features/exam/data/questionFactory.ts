import type { ExamQuestion } from '@/features/exam/types/question';

const LETTERS = ['A', 'B', 'C', 'D'] as const;

/** Crea una pregunta ICFES con 4 opciones (índice correcto 0–3). */
export function makeQuestion(
  id: string,
  text: string,
  optionTexts: [string, string, string, string],
  correctIndex: 0 | 1 | 2 | 3,
  explanation: string,
  difficulty: 'básico' | 'intermedio' = 'básico'
): ExamQuestion {
  return {
    id,
    text,
    options: optionTexts.map((optText, i) => ({
      id: String.fromCharCode(97 + i),
      text: optText,
      letter: LETTERS[i],
    })),
    correctAnswer: String.fromCharCode(97 + correctIndex),
    explanation,
    difficulty,
  };
}
