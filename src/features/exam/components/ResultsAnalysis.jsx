import { Link } from 'react-router-dom';

export const ResultsAnalysis = ({ results, questions, percentage, correctCount, examConfig, onRetry }) => {
 return (
 <div className="space-y-6">
 {/* Results Summary */}
 <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl shadow-2xl p-12">
 <div className="text-center mb-12">
 <h1 className="text-5xl md:text-6xl font-bold mb-8 bg-linear-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
 ¡Examen Completado!
 </h1>
 <div className="text-7xl font-black text-transparent bg-linear-to-r from-blue-400 to-cyan-400 bg-clip-text mb-4">
 {percentage}%
 </div>
 <p className="text-xl text-gray-300 mb-2">Calificación Final</p>
 <p className="text-lg text-gray-400">
 {correctCount} de {questions.length} respuestas correctas
 </p>
 </div>

 <div className="bg-white/10 rounded-full h-3 overflow-hidden mb-12">
 <div
 className="bg-linear-to-r from-blue-500 to-cyan-500 h-full transition-all duration-700"
 style={{ width: `${percentage}%` }}
 ></div>
 </div>

 <div className="flex gap-4 flex-wrap justify-center">
 <button
 onClick={onRetry}
 className="cursor-pointer bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-8 rounded-xl transition-all duration-300 hover:shadow-lg hover:scale-105"
 >
 Intentar de Nuevo
 </button>
 <Link
 to="/"
 className="cursor-pointer bg-linear-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold py-3 px-8 rounded-xl transition-all duration-300 hover:shadow-lg hover:scale-105"
 >
 Volver al Inicio
 </Link>
 </div>
 </div>

 {/* Detailed Results */}
 <div className="space-y-6">
 <h2 className="text-2xl font-bold text-white mb-8">Análisis Detallado</h2>
 {results.map((result, idx) => {
 const isCorrect = result.correct;

 return (
 <div
 key={result.question.id}
 className="bg-linear-to-br from-gray-800/40 via-gray-900/40 to-gray-950/40 backdrop-blur-md border border-white/10 rounded-xl p-6 shadow-lg hover:shadow-xl hover:border-white/20 transition-all duration-300"
 >
 {/* Question Header */}
 <div className="mb-6">
 <div className="flex items-start gap-4">
 <div className={`shrink-0 w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm ${
 isCorrect
 ? 'bg-linear-to-r from-green-500 to-emerald-500'
 : 'bg-linear-to-r from-red-500 to-rose-500'
 }`}>
 {isCorrect ? '' : ''}
 </div>
 <div className="flex-1">
 <div className="flex items-center justify-between mb-2">
 <p className="text-white font-semibold text-lg leading-relaxed">
 Pregunta {idx + 1}
 </p>
 <span className={`px-3 py-1 rounded-lg text-xs font-bold ${
 isCorrect
 ? 'bg-green-500/20 text-green-300'
 : 'bg-red-500/20 text-red-300'
 }`}>
 {isCorrect ? 'Correcta' : 'Incorrecta'}
 </span>
 </div>
 <p className="text-white font-semibold text-lg leading-relaxed">
 {result.question.text}
 </p>
 </div>
 </div>
 </div>

 {/* User Answer and Correct Answer */}
 <div className="ml-14 space-y-4">
 <div>
 <p className="text-sm text-cyan-300 font-semibold mb-2">Tu respuesta:</p>
 <div className="p-3 rounded-lg bg-cyan-500/10 border border-cyan-500/30">
 {result.userAnswer ? (
 <p className="text-white">
 <span className="font-bold text-cyan-300">{result.userAnswer}.</span> {
 result.question.options.find(o => o.letter === result.userAnswer)?.text
 }
 </p>
 ) : (
 <p className="text-gray-400 italic">Sin responder</p>
 )}
 </div>
 </div>

 {!isCorrect && (
 <div>
 <p className="text-sm text-green-300 font-semibold mb-2">Respuesta correcta:</p>
 <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/30">
 <p className="text-white">
 <span className="font-bold text-green-300">{result.question.correctAnswer}.</span> {
 result.question.options.find(o => o.letter === result.question.correctAnswer)?.text
 }
 </p>
 </div>
 </div>
 )}

 {/* Explanation */}
 {examConfig.showExplanations && (
 <div>
 <p className="text-sm text-blue-300 font-semibold mb-2">Explicación:</p>
 <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/30">
 <p className="text-gray-200">{result.question.explanation}</p>
 </div>
 </div>
 )}
 </div>
 </div>
 );
 })}
 </div>
 </div>
 );
};
