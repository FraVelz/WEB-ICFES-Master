export interface QuestionOption {
  id: string;
  text: string;
  letter?: string; // A, B, C, D para coincidir con correctAnswer
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
