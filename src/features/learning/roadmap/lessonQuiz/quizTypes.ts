export interface QuizQuestionInput {
  id?: string;
  question?: string;
  text?: string;
  options?: (string | { id?: string; text?: string; content?: string; letter?: string })[];
  correct_answer?: number;
  correctAnswer?: number | string;
  explanation?: string;
  difficulty?: string;
}

export interface QuizInput {
  question?: string;
  options?: (string | { id?: string; text?: string; content?: string; letter?: string })[];
  correctAnswer?: string;
  explanation?: string;
  difficulty?: string;
  questions?: QuizQuestionInput[];
  rewards?: { xp?: number; coins?: number };
}

export type NormalizedQuizQuestion = {
  id: string;
  question: string;
  options: { id: string; text: string }[];
  correctAnswer: string;
  explanation: string;
  difficulty: string;
};

export type LessonQuizGradeResult = {
  questionId: string;
  correct: boolean;
  correctAnswer: string;
  explanation: string;
};

export interface LessonQuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete?: (result?: { correct: number; total: number }) => void;
  questions?: QuizQuestionInput[];
  quiz?: QuizInput;
  lessonId?: string | null;
  lessonTitle?: string;
  lessonXp?: number;
  lessonCoins?: number;
}
