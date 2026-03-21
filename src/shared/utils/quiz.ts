interface ResultItem {
  correct: boolean;
  question?: { area?: string };
}

export const calculateScore = (results: ResultItem[] = []) => {
  if (results.length === 0) return 0;
  const correctCount = results.filter((r) => r.correct).length;
  return Math.round((correctCount / results.length) * 100);
};

export const getAreaResults = (results: ResultItem[] = []) => {
  const areas: Record<string, { total: number; correct: number }> = {
    mathematics: { total: 0, correct: 0 },
    lenguaje: { total: 0, correct: 0 },
    science: { total: 0, correct: 0 },
    social: { total: 0, correct: 0 },
  };

  results.forEach((result) => {
    const area = result.question?.area ?? 'mathematics';
    if (area in areas) {
      areas[area].total += 1;
      if (result.correct) areas[area].correct += 1;
    }
  });

  return areas;
};

export const shuffleArray = <T>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

interface QuestionWithArea {
  area?: string;
  difficulty?: string;
}

export const getQuestionsByArea = (
  questions: QuestionWithArea[],
  area: string
) => {
  return questions.filter((q) => q.area === area);
};

export const getDifficultyStats = (questions: QuestionWithArea[] = []) => {
  return {
    easy: questions.filter((q) => q.difficulty === 'fácil').length,
    medium: questions.filter((q) => q.difficulty === 'medio').length,
    hard: questions.filter((q) => q.difficulty === 'difícil').length,
  };
};
