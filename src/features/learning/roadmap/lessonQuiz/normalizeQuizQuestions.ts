import type { NormalizedQuizQuestion, QuizInput, QuizQuestionInput } from './quizTypes';

function normalizeOptions(options: unknown): { id: string; text: string }[] {
  if (!Array.isArray(options) || options.length === 0) return [];

  if (typeof options[0] === 'string') {
    return options.map((opt, i) => ({
      id: String.fromCharCode(97 + i),
      text: opt,
    }));
  }

  return options.map((opt, i) => {
    if (typeof opt === 'string') {
      return { id: String.fromCharCode(97 + i), text: opt };
    }
    const o = opt as Record<string, unknown>;
    return {
      id: String(o?.id ?? o?.letter ?? String.fromCharCode(97 + i)),
      text: String(o?.text ?? o?.content ?? opt),
    };
  });
}

function mapQuestion(q: QuizQuestionInput, index: number, idPrefix: string): NormalizedQuizQuestion {
  const options = normalizeOptions(q.options);
  const correctAnswerIndex =
    typeof q.correct_answer === 'number'
      ? q.correct_answer
      : typeof q.correctAnswer === 'number'
        ? q.correctAnswer
        : null;

  let correctAnswer: string;
  if (correctAnswerIndex !== null && options[correctAnswerIndex]) {
    correctAnswer = options[correctAnswerIndex].id;
  } else if (q.correctAnswer && typeof q.correctAnswer === 'string') {
    correctAnswer = q.correctAnswer;
  } else if (options.length > 0) {
    correctAnswer = options[0].id;
  } else {
    correctAnswer = 'a';
  }

  return {
    id: q.id || `${idPrefix}_${index}`,
    question: q.question || q.text || '',
    options,
    correctAnswer,
    explanation: q.explanation || '',
    difficulty: q.difficulty || 'media',
  };
}

export function normalizeQuizQuestions(questions?: QuizQuestionInput[], quiz?: QuizInput): NormalizedQuizQuestion[] {
  if (questions?.length) {
    return questions.map((q, index) => mapQuestion(q, index, 'question'));
  }

  if (quiz?.questions?.length) {
    return quiz.questions.map((q, index) => mapQuestion(q, index, 'quiz_question'));
  }

  if (quiz) {
    const options = normalizeOptions(quiz.options);
    const correctAnswer = quiz.correctAnswer ?? options[0]?.id ?? 'a';
    return [
      {
        id: 'quiz_1',
        question: quiz.question || '',
        options,
        correctAnswer,
        explanation: quiz.explanation || '',
        difficulty: quiz.difficulty || 'media',
      },
    ];
  }

  return [];
}
