export const AnswerSheet = ({
  totalQuestions,
  answers,
  currentQuestion,
  onQuestionClick,
}) => {
  return (
    <div className="sticky top-6 h-fit rounded-xl border border-white/10 bg-linear-to-br from-gray-800/40 via-gray-900/40 to-gray-950/40 p-4 shadow-2xl backdrop-blur-md">
      <h3 className="mb-4 flex items-center gap-2 text-sm font-bold text-white">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-linear-to-r from-cyan-500 to-blue-500 text-xs font-bold"></span>
        HOJA DE RESPUESTAS
      </h3>

      <div className="grid grid-cols-5 gap-2">
        {Array.from({ length: totalQuestions }).map((_, idx) => {
          const questionNum = idx + 1;
          const answer = answers[questionNum];
          const isAnswered = answer !== undefined;
          const isCurrent = currentQuestion === questionNum;

          return (
            <button
              key={questionNum}
              onClick={() => onQuestionClick(idx)}
              className={`flex aspect-square items-center justify-center rounded-lg text-xs font-bold transition-all duration-300 ${
                isCurrent
                  ? 'scale-110 bg-cyan-500/30 text-cyan-300 ring-2 ring-cyan-400'
                  : isAnswered
                    ? 'bg-linear-to-r from-green-500 to-emerald-500 text-white hover:shadow-lg hover:shadow-green-500/50'
                    : 'border border-white/20 bg-white/10 text-gray-400 hover:bg-white/20'
              }`}
            >
              {isAnswered ? (
                <span className="text-xs">{answer}</span>
              ) : (
                <span>{questionNum}</span>
              )}
            </button>
          );
        })}
      </div>

      <div className="mt-6 space-y-2 text-xs text-gray-400">
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded border border-white/20 bg-white/10"></div>
          <span>No respondidas</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded bg-linear-to-r from-green-500 to-emerald-500"></div>
          <span>Respondidas</span>
        </div>
      </div>
    </div>
  );
};
