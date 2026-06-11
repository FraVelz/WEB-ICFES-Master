export interface QuestionOption {
  id: string;
  text: string;
  letter?: string; // A, B, C, D — matches correctAnswer option id
}

export interface ExamQuestion {
  id: string;
  text: string;
  options: QuestionOption[];
  correctAnswer: string;
  explanation?: string;
  difficulty?: string;
  showExplanations?: boolean;
}

/** Pregunta enviada al cliente durante el examen (sin respuesta correcta). */
export type ExamQuestionPublic = Omit<ExamQuestion, 'correctAnswer'>;

export function toPublicExamQuestion(question: ExamQuestion): ExamQuestionPublic {
  const { correctAnswer: _removed, ...publicQuestion } = question;
  return publicQuestion;
}
