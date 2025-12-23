export const AnswerSheet = ({ totalQuestions, answers, currentQuestion, onQuestionClick, questions = [] }) => {
 return (
 <div className="sticky top-6 h-fit bg-linear-to-br from-gray-800/40 via-gray-900/40 to-gray-950/40 backdrop-blur-md border border-white/10 rounded-xl p-4 shadow-2xl">
 <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
 <span className="w-8 h-8 bg-linear-to-r from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center text-xs font-bold">

 </span>
 HOJA DE RESPUESTAS
 </h3>

 <div className="grid grid-cols-5 gap-2">
 {Array.from({ length: totalQuestions }).map((_, idx) => {
 const question = questions[idx];
 const questionId = question?.id ?? (idx + 1);
 const questionNum = idx + 1;
 const answer = answers[questionId];
 const isAnswered = answer !== undefined;
 const isCurrent = currentQuestion === idx;

 return (
 <button
 key={questionNum}
 onClick={() => onQuestionClick(idx)}
 className={`aspect-square flex items-center justify-center rounded-lg font-bold text-xs transition-all duration-300 ${
 isCurrent
 ? 'ring-2 ring-cyan-400 bg-cyan-500/30 text-cyan-300 scale-110'
 : isAnswered
 ? 'bg-linear-to-r from-green-500 to-emerald-500 text-white hover:shadow-lg hover:shadow-green-500/50'
 : 'bg-white/10 text-gray-400 hover:bg-white/20 border border-white/20'
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
 <div className="w-4 h-4 rounded bg-white/10 border border-white/20"></div>
 <span>No respondidas</span>
 </div>
 <div className="flex items-center gap-2">
 <div className="w-4 h-4 rounded bg-linear-to-r from-green-500 to-emerald-500"></div>
 <span>Respondidas</span>
 </div>
 </div>
 </div>
 );
};
