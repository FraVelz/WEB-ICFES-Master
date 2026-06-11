type QuizQuestionRecord = Record<string, unknown>;

function stripQuestionFields(question: QuizQuestionRecord): QuizQuestionRecord {
  const { correct_answer: _a, correctAnswer: _b, ...rest } = question;
  return rest;
}

/** Elimina respuestas correctas del contenido de lección antes de enviarlo al cliente. */
export function stripQuizAnswersFromContent(content: Record<string, unknown>): Record<string, unknown> {
  const next = { ...content };

  if (Array.isArray(next.questions)) {
    next.questions = next.questions.map((q) =>
      typeof q === 'object' && q !== null ? stripQuestionFields(q as QuizQuestionRecord) : q
    );
  }

  if (next.quiz && typeof next.quiz === 'object' && next.quiz !== null) {
    const quiz = { ...(next.quiz as QuizQuestionRecord) };
    delete quiz.correctAnswer;
    delete quiz.correct_answer;

    if (Array.isArray(quiz.questions)) {
      quiz.questions = quiz.questions.map((q) =>
        typeof q === 'object' && q !== null ? stripQuestionFields(q as QuizQuestionRecord) : q
      );
    }

    next.quiz = quiz;
  }

  return next;
}
