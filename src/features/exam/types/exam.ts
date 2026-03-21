export interface AnswerRecord {
  questionId: string;
  selectedAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  timeSpent?: number;
  savedAt?: string;
}

export interface ExamData {
  type?: string;
  area?: string | null;
  difficulty?: string;
  questions?: unknown[];
  timeLimit?: number | null;
}

export interface ExamRecord {
  id: string;
  userId?: string;
  type?: string;
  area?: string | null;
  difficulty?: string;
  totalQuestions?: number;
  questions?: { id?: string; area?: string; difficulty?: string; text?: string; explanation?: string }[];
  answers: AnswerRecord[];
  startedAt?: string;
  completedAt?: string | null;
  score?: number | null;
  status?: string;
  totalTime?: number;
  correctAnswers?: number;
  wrongAnswers?: number;
  grade?: string;
}
