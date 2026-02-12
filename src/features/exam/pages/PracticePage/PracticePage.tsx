import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisVertical, faArrowRightFromBracket, faClipboard } from '@fortawesome/free-solid-svg-icons';
import { ExamConfigModal, AnswerSheet, ResultsAnalysis } from '@/features/exam/components';
import { formatTimeExtended } from '@/shared/utils';
import { AREA_INFO } from '@/shared/constants';
import { 
  MATHEMATICS_QUESTIONS,
  LANGUAGE_QUESTIONS,
  SCIENCE_QUESTIONS,
  SOCIAL_QUESTIONS
} from '@/shared/data';

const AREA_QUESTIONS = {
  'lectura-critica': LANGUAGE_QUESTIONS,
  'matematicas': MATHEMATICS_QUESTIONS,
  'ciencias-naturales': SCIENCE_QUESTIONS,
  'sociales-ciudadanas': SOCIAL_QUESTIONS
};

export const PracticePage = () => {
  const { area } = useParams();
  const allQuestions = AREA_QUESTIONS[area] || [];
  const areaInfo = AREA_INFO[area] || { name: 'Examen Completo', color: 'from-pink-400 to-pink-600' };

  const [examConfig, setExamConfig] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [isFinished, setIsFinished] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showAnswerSheetMobile, setShowAnswerSheetMobile] = useState(false);

  const handleExamStart = (config) => {
    const selectedQuestions = allQuestions.slice(0, config.numQuestions);
    setQuestions(selectedQuestions);
    setExamConfig(config);

    if (config.useTimer) {
      setTimeRemaining(config.numQuestions * config.timePerQuestion * 60);
    }
  };

  useEffect(() => {
    if (!timeRemaining || timeRemaining <= 0) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          setIsFinished(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining]);

  const handleAnswer = (questionId, answer) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleScrollToQuestion = (index) => {
    const questionElement = document.getElementById(`question-${index}`);
    questionElement?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // Guardar examen cuando se finaliza

  if (!examConfig) {
    return <ExamConfigModal area={area} totalQuestions={allQuestions.length} onStart={handleExamStart} />;
  }

  if (isFinished || showResults) {
    const results = questions.map((q) => ({
      question: q,
      correct: answers[q.id] === q.correctAnswer,
      userAnswer: answers[q.id]
    }));

    const correctCount = results.filter((r) => r.correct).length;
    const percentage = Math.round((correctCount / questions.length) * 100);

    return (
      <div className="min-h-[100dvh] bg-linear-to-br from-gray-900 via-slate-900 to-gray-900 text-white">
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        </div>

        <div className="relative z-10">
          {/* Header */}
          <div className="sticky top-0 z-40 bg-linear-to-b from-gray-900 via-gray-900 to-transparent backdrop-blur-md border-b border-white/10 py-4">
            <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
              <div>
                <div className={`inline-block bg-linear-to-r ${areaInfo.color} text-white px-3 py-1 rounded-lg font-semibold text-xs mb-2`}>
                  {areaInfo.name}
                </div>
                <p className="text-sm text-gray-400">
                  Análisis de Resultados
                </p>
              </div>

              {/* Desktop Exit Button */}
              <Link
                to="/"
                className="hidden md:block bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg text-sm transition-all duration-300"
              >
                Salir
              </Link>

              {/* Mobile Menu Button */}
              <div className="md:hidden relative">
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="text-white p-2"
                >
                  <FontAwesomeIcon icon={faEllipsisVertical} className="text-xl" />
                </button>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                  <div className="fixed right-4 top-20 bg-gray-800 border border-white/20 rounded-lg shadow-xl overflow-hidden z-50 w-48">
                    <button
                      onClick={() => setShowAnswerSheetMobile(true)}
                      className="w-full flex items-center gap-3 px-4 py-3 text-white hover:bg-white/10 transition-colors border-b border-white/10"
                    >
                      <FontAwesomeIcon icon={faClipboard} className="text-sm" />
                      <span>Ver Respuestas</span>
                    </button>
                    <Link
                      to="/"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-white hover:bg-white/10 transition-colors"
                    >
                      <FontAwesomeIcon icon={faArrowRightFromBracket} className="text-sm" />
                      <span>Salir</span>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Results Column */}
              <div className="lg:col-span-3">
                <ResultsAnalysis
                  results={results}
                  questions={questions}
                  percentage={percentage}
                  correctCount={correctCount}
                  areaInfo={areaInfo}
                  examConfig={examConfig}
                  onRetry={() => {
                    setExamConfig(null);
                    setAnswers({});
                    setShowResults(false);
                    setIsFinished(false);
                  }}
                />
              </div>

              {/* Answer Sheet Sidebar */}
              <div>
                <AnswerSheet
                  totalQuestions={questions.length}
                  answers={answers}
                  currentQuestion={0}
                  onQuestionClick={handleScrollToQuestion}
                  questions={questions}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const timeColor =
    timeRemaining < 300
      ? 'text-red-400'
      : timeRemaining < 600
      ? 'text-yellow-400'
      : 'text-cyan-300';

  return (
    <div className="min-h-[100dvh] bg-linear-to-br from-gray-900 via-slate-900 to-gray-900 text-white">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="sticky top-0 z-40 bg-linear-to-b from-gray-900 via-gray-900 to-transparent backdrop-blur-md border-b border-white/10 py-4">
          <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
            <div>
              <div className={`inline-block bg-linear-to-r ${areaInfo.color} text-white px-3 py-1 rounded-lg font-semibold text-xs mb-2`}>
                {areaInfo.name}
              </div>
              <p className="text-sm text-gray-400">
                Preguntas: {questions.length}
              </p>
            </div>

            {examConfig.useTimer && (
              <div className={`text-2xl font-bold font-mono ${timeColor}`}>
                {formatTimeExtended(timeRemaining)}
              </div>
            )}

            {/* Desktop Exit Button */}
            <Link
              to="/"
              className="hidden md:block bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg text-sm transition-all duration-300"
            >
              Salir
            </Link>

            {/* Mobile Menu Button */}
            <div className="md:hidden relative">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-white p-2"
              >
                <FontAwesomeIcon icon={faEllipsisVertical} className="text-xl" />
              </button>

              {/* Mobile Menu */}
              {mobileMenuOpen && (
                <div className="fixed right-4 top-20 bg-gray-800 border border-white/20 rounded-lg shadow-xl overflow-hidden z-50 w-48">
                  <button
                    onClick={() => {
                      setShowAnswerSheetMobile(true);
                      setMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-white hover:bg-white/10 transition-colors border-b border-white/10"
                  >
                    <FontAwesomeIcon icon={faClipboard} className="text-sm" />
                    <span>Ver Respuestas</span>
                  </button>
                  <Link
                    to="/"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-white hover:bg-white/10 transition-colors"
                  >
                    <FontAwesomeIcon icon={faArrowRightFromBracket} className="text-sm" />
                    <span>Salir</span>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Questions Column */}
            <div className="lg:col-span-3 space-y-6">
              {questions.map((question, index) => (
                <div
                  key={question.id}
                  id={`question-${index}`}
                  className="bg-linear-to-br from-gray-800/40 via-gray-900/40 to-gray-950/40 backdrop-blur-md border border-white/10 rounded-xl p-6 shadow-lg hover:shadow-xl hover:border-white/20 transition-all duration-300"
                >
                  {/* Question Number and Title */}
                  <div className="mb-6">
                    <div className="flex items-start gap-4">
                      <div className="shrink-0 w-10 h-10 bg-linear-to-r from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center font-bold text-sm">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <p className="text-white font-semibold text-lg leading-relaxed">
                          {question.text}
                        </p>
                        <p className="text-xs text-gray-500 mt-2">
                          Dificultad: <span className="text-cyan-300">{question.difficulty}</span>
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Answer Options */}
                  <div className="space-y-3 ml-14">
                    {question.options.map((option) => {
                      const isSelected = answers[question.id] === option.letter;

                      return (
                        <button
                          key={option.letter}
                          onClick={() => handleAnswer(question.id, option.letter)}
                          className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-300 ${
                            isSelected
                              ? 'border-cyan-400 bg-cyan-500/20 text-cyan-100'
                              : 'border-white/20 bg-white/5 text-white hover:border-cyan-400/50 hover:bg-cyan-500/10'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold text-sm ${
                                isSelected
                                  ? 'border-cyan-400 bg-cyan-500 text-white'
                                  : 'border-white/30'
                              }`}
                            >
                              {option.letter}
                            </div>
                            <span>{option.text}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Explanation - Only shown after exam finishes */}
                  {showResults && examConfig.showExplanations && answers[question.id] && (
                    <div className="mt-6 ml-14 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                      <p className="text-xs font-semibold text-blue-300 mb-2">EXPLICACIÓN:</p>
                      <p className="text-sm text-gray-200">{question.explanation}</p>
                    </div>
                  )}
                </div>
              ))}

              {/* Final Button */}
              <div className="flex justify-center pt-8">
                <button
                  onClick={() => setShowResults(true)}
                  className="bg-linear-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold py-4 px-12 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-green-500/50 text-lg"
                >
                  Finalizar Examen
                </button>
              </div>
            </div>

            {/* Answer Sheet Sidebar */}
            <div>
              <AnswerSheet
                totalQuestions={questions.length}
                answers={answers}
                currentQuestion={0}
                onQuestionClick={handleScrollToQuestion}
                questions={questions}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Answer Sheet Modal */}
      {showAnswerSheetMobile && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 md:hidden">
          <div className="bg-gray-800 rounded-xl border border-white/20 w-full max-w-md max-h-[80vh] overflow-y-auto">
            <div className="sticky top-0 bg-gray-900 border-b border-white/10 p-4 flex items-center justify-between">
              <h3 className="font-bold text-white">Hoja de Respuestas</h3>
              <button
                onClick={() => setShowAnswerSheetMobile(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>
            <div className="p-4">
              <AnswerSheet
                totalQuestions={questions.length}
                answers={answers}
                currentQuestion={0}
                onQuestionClick={(index) => {
                  handleScrollToQuestion(index);
                  setShowAnswerSheetMobile(false);
                }}
                questions={questions}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
