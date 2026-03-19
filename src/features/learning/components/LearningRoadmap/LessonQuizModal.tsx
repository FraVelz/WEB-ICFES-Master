import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTimes, faCoins, faStar, faTrophy, faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '@/context/AuthContext';
import GamificationServiceAdapter from '@/services/GamificationServiceAdapter';
import { getCompletedLessons, markLessonAsCompleted } from '@/shared/utils/progressStorage';

export const LessonQuizModal = ({ isOpen, onClose, onComplete, questions, quiz, lessonId, lessonTitle, lessonXp, lessonCoins }) => {
  const { user } = useAuth();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alreadyCompleted, setAlreadyCompleted] = useState(false);
  const [rewards, setRewards] = useState(null);
  const [answers, setAnswers] = useState({}); // Para almacenar respuestas de múltiples preguntas
  const [completedQuestions, setCompletedQuestions] = useState(new Set());

  // Función auxiliar para normalizar opciones
  const normalizeOptions = (options) => {
    if (!Array.isArray(options) || options.length === 0) {
      return [];
    }
    
    // Si es array de strings, convertir a formato {id, text}
    if (typeof options[0] === 'string') {
      return options.map((opt, i) => ({ 
        id: String.fromCharCode(97 + i), 
        text: opt 
      }));
    }
    
    // Si es array de objetos, normalizar
    return options.map((opt, i) => {
      if (typeof opt === 'string') {
        return { id: String.fromCharCode(97 + i), text: opt };
      }
      // Si ya tiene id y text, usarlos; si no, generar
      return {
        id: opt.id || opt.letter || String.fromCharCode(97 + i),
        text: opt.text || opt.content || String(opt)
      };
    });
  };

  // Normalizar preguntas: convertir questions array a formato compatible o usar quiz
  const normalizedQuestions = React.useMemo(() => {
    // Prioridad 1: questions array directo
    if (questions && Array.isArray(questions) && questions.length > 0) {
      return questions.map((q, index) => {
        const options = normalizeOptions(q.options);
        
        // Convertir correct_answer (índice) a correctAnswer (id)
        const correctAnswerIndex = typeof q.correct_answer === 'number' ? q.correct_answer : 
                                   typeof q.correctAnswer === 'number' ? q.correctAnswer : null;
        
        let correctAnswer;
        if (correctAnswerIndex !== null && options[correctAnswerIndex]) {
          correctAnswer = options[correctAnswerIndex].id;
        } else if (q.correctAnswer) {
          correctAnswer = q.correctAnswer;
        } else if (options.length > 0) {
          correctAnswer = options[0].id;
        } else {
          correctAnswer = 'a';
        }

        return {
          id: q.id || `question_${index}`,
          question: q.question || q.text || '',
          options: options,
          correctAnswer: correctAnswer,
          explanation: q.explanation || '',
          difficulty: q.difficulty || 'media'
        };
      });
    } 
    // Prioridad 2: quiz.questions (array de preguntas dentro del quiz)
    else if (quiz && quiz.questions && Array.isArray(quiz.questions) && quiz.questions.length > 0) {
      return quiz.questions.map((q, index) => {
        const options = normalizeOptions(q.options);
        
        const correctAnswerIndex = typeof q.correct_answer === 'number' ? q.correct_answer : 
                                   typeof q.correctAnswer === 'number' ? q.correctAnswer : null;
        
        let correctAnswer;
        if (correctAnswerIndex !== null && options[correctAnswerIndex]) {
          correctAnswer = options[correctAnswerIndex].id;
        } else if (q.correctAnswer) {
          correctAnswer = q.correctAnswer;
        } else if (options.length > 0) {
          correctAnswer = options[0].id;
        } else {
          correctAnswer = 'a';
        }

        return {
          id: q.id || `quiz_question_${index}`,
          question: q.question || q.text || '',
          options: options,
          correctAnswer: correctAnswer,
          explanation: q.explanation || '',
          difficulty: q.difficulty || 'media'
        };
      });
    }
    // Prioridad 3: quiz único (formato antiguo)
    else if (quiz) {
      const options = normalizeOptions(quiz.options);
      
      let correctAnswer;
      if (quiz.correctAnswer) {
        correctAnswer = quiz.correctAnswer;
      } else if (options.length > 0) {
        correctAnswer = options[0].id;
      } else {
        correctAnswer = 'a';
      }

      return [{
        id: 'quiz_1',
        question: quiz.question || '',
        options: options,
        correctAnswer: correctAnswer,
        explanation: quiz.explanation || '',
        difficulty: quiz.difficulty || 'media'
      }];
    }
    
    return [];
  }, [questions, quiz]);

  const currentQuestion = normalizedQuestions[currentQuestionIndex];
  const totalQuestions = normalizedQuestions.length;
  const isLastQuestion = currentQuestionIndex === totalQuestions - 1;
  const allQuestionsAnswered = completedQuestions.size === totalQuestions;

  useEffect(() => {
    if (isOpen && user && lessonId) {
      checkCompletionStatus();
    }
    // Reset state when modal opens
    if (isOpen) {
      setCurrentQuestionIndex(0);
      setSelectedOption(null);
      setIsSubmitted(false);
      setIsCorrect(false);
      setRewards(null);
      setAnswers({});
      setCompletedQuestions(new Set());
    }
  }, [isOpen, user, lessonId]);

  // Reset cuando cambia la pregunta actual
  useEffect(() => {
    if (currentQuestion) {
      const savedAnswer = answers[currentQuestion.id];
      const isCompleted = completedQuestions.has(currentQuestion.id);
      setSelectedOption(savedAnswer || null);
      setIsSubmitted(isCompleted);
      setIsCorrect(savedAnswer === currentQuestion.correctAnswer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentQuestionIndex, currentQuestion?.id]);

  const checkCompletionStatus = async () => {
    try {
      const completedLessons = getCompletedLessons();
      const wasCompleted = completedLessons.includes(lessonId);
      setAlreadyCompleted(wasCompleted);
      console.log('Estado de completitud de lección:', { lessonId, wasCompleted, completedLessons });
    } catch (error) {
      console.error('Error checking completion status:', error);
      // Si hay error, asumir que no está completada para permitir intentar
      setAlreadyCompleted(false);
    }
  };

  const handleSubmit = async () => {
    if (!selectedOption || loading || !currentQuestion) return;

    const correct = selectedOption === currentQuestion.correctAnswer;
    setIsCorrect(correct);
    setIsSubmitted(true);

    // Guardar respuesta con la respuesta actual incluida
    const updatedAnswers = { ...answers, [currentQuestion.id]: selectedOption };
    setAnswers(updatedAnswers);
    setCompletedQuestions(prev => new Set([...prev, currentQuestion.id]));

    // Verificar si todas las preguntas están respondidas
    const allQuestionsAnswered = normalizedQuestions.every(q => {
      return updatedAnswers[q.id] !== undefined && updatedAnswers[q.id] !== null;
    });

    // Verificar si todas las preguntas están correctas (incluyendo la actual)
    const allCorrect = normalizedQuestions.every(q => {
      const answer = updatedAnswers[q.id];
      return answer === q.correctAnswer;
    });

    console.log('Estado del quiz:', {
      isLastQuestion,
      allQuestionsAnswered,
      allCorrect,
      alreadyCompleted,
      totalQuestions,
      answersCount: Object.keys(updatedAnswers).length,
      completedQuestionsCount: completedQuestions.size,
      updatedAnswers
    });

    // Otorgar recompensas cuando se complete la última pregunta (todas respondidas)
    // Solo si no se ha completado antes
    if (isLastQuestion && allQuestionsAnswered && !alreadyCompleted && user?.uid) {
      setLoading(true);
      try {
        // Obtener recompensas: prioridad: lessonXp/lessonCoins > quiz.rewards > valores por defecto (500/250)
        const xpAmount = lessonXp ?? quiz?.rewards?.xp ?? 500;
        const coinsAmount = lessonCoins ?? quiz?.rewards?.coins ?? 250;

        console.log('=== OTORGANDO RECOMPENSAS ===');
        console.log('Datos:', { 
          xpAmount, 
          coinsAmount, 
          lessonXp, 
          lessonCoins, 
          quizRewards: quiz?.rewards,
          allCorrect,
          allQuestionsAnswered,
          userId: user.uid,
          lessonId
        });

        // Otorgar XP y monedas
        console.log('Llamando addXP...');
        const xpResult = await GamificationServiceAdapter.addXP(user.uid, xpAmount, `lesson_quiz_${lessonId}`);
        console.log('XP otorgado:', xpResult);
        
        console.log('Llamando addCoins...');
        const coinsResult = await GamificationServiceAdapter.addCoins(user.uid, coinsAmount, `lesson_quiz_${lessonId}`);
        console.log('Monedas otorgadas:', coinsResult);
        
        console.log('Resultados de recompensas:', { xpResult, coinsResult });

        // Marcar lección como completada
        console.log('Marcando lección como completada...');
        markLessonAsCompleted(user?.uid, lessonId);
        console.log('Lección marcada como completada');

        setRewards({ xp: xpAmount, coins: coinsAmount });
        setAlreadyCompleted(true);
        console.log('=== RECOMPENSAS OTORGADAS EXITOSAMENTE ===');
      } catch (error) {
        console.error('=== ERROR OTORGANDO RECOMPENSAS ===', error);
        console.error('Detalles del error:', {
          message: error.message,
          stack: error.stack,
          userId: user?.uid,
          lessonId,
          xpAmount: lessonXp ?? quiz?.rewards?.xp ?? 500,
          coinsAmount: lessonCoins ?? quiz?.rewards?.coins ?? 250
        });
        // Mostrar error al usuario si es necesario
      }
      setLoading(false);
    } else if (totalQuestions === 1 && correct && !alreadyCompleted && user?.uid) {
      // Si solo hay una pregunta y está correcta, otorgar recompensas inmediatamente
      setLoading(true);
      try {
        // Obtener recompensas: prioridad: lessonXp/lessonCoins > quiz.rewards > valores por defecto (500/250)
        const xpAmount = lessonXp ?? quiz?.rewards?.xp ?? 500;
        const coinsAmount = lessonCoins ?? quiz?.rewards?.coins ?? 250;

        console.log('Otorgando recompensas (pregunta única):', { 
          xpAmount, 
          coinsAmount, 
          lessonXp, 
          lessonCoins, 
          quizRewards: quiz?.rewards,
          userId: user.uid,
          lessonId
        });

        // Otorgar XP y monedas
        const xpResult = await GamificationServiceAdapter.addXP(user.uid, xpAmount, `lesson_quiz_${lessonId}`);
        const coinsResult = await GamificationServiceAdapter.addCoins(user.uid, coinsAmount, `lesson_quiz_${lessonId}`);
        
        console.log('Resultados de recompensas (pregunta única):', { xpResult, coinsResult });

        // Marcar lección como completada
        markLessonAsCompleted(user?.uid, lessonId);

        setRewards({ xp: xpAmount, coins: coinsAmount });
        setAlreadyCompleted(true);
      } catch (error) {
        console.error('Error awarding rewards:', error);
      }
      setLoading(false);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsSubmitted(false);
      setIsCorrect(false);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  if (!isOpen || !currentQuestion) return null;

  return (
    <div className="fixed inset-0 z-[70] bg-black/80 backdrop-blur-sm flex items-end lg:items-center justify-center p-0 lg:p-4 pb-20 lg:pb-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border-t lg:border border-slate-800 rounded-t-2xl lg:rounded-2xl max-w-lg w-full max-h-[calc(95vh-5rem)] lg:max-h-[90vh] overflow-hidden shadow-2xl transform transition-all scale-100 flex flex-col">
        
        {/* Header */}
        <div className="bg-slate-800/50 p-3.5 lg:p-6 border-b border-slate-800 shrink-0">
          <div className="flex items-center justify-center gap-2 mb-1">
            <FontAwesomeIcon icon={faTrophy} className="text-yellow-400 text-base lg:text-lg" />
            <h3 className="text-base lg:text-xl font-bold text-white text-center">
              Prueba de Conocimiento
            </h3>
          </div>
          <p className="text-slate-400 text-center text-xs lg:text-sm mt-1.5 line-clamp-2">
            {lessonTitle}
          </p>
          {totalQuestions > 1 && (
            <div className="flex items-center justify-center gap-2 mt-2.5">
              {/* Barra de progreso visual */}
              <div className="flex-1 h-1.5 bg-slate-700/50 rounded-full overflow-hidden max-w-[120px]">
                <div 
                  className="h-full bg-blue-500 transition-all duration-300 rounded-full"
                  style={{ width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%` }}
                />
              </div>
              <span className="text-xs text-slate-400 font-medium whitespace-nowrap">
                {currentQuestionIndex + 1}/{totalQuestions}
              </span>
            </div>
          )}
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-3.5 lg:p-6 min-h-0 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
          <div className="mb-3 lg:mb-6">
            <h4 className="text-base lg:text-lg text-white font-semibold mb-3 lg:mb-4 leading-relaxed px-0.5">
              {currentQuestion.question}
            </h4>
            
            <div className="space-y-2 lg:space-y-3">
              {currentQuestion.options.map((option, index) => (
                <button
                  key={option.id}
                  onClick={() => !isSubmitted && setSelectedOption(option.id)}
                  disabled={isSubmitted}
                  className={`cursor-pointer w-full p-3.5 lg:p-4 min-h-[52px] lg:min-h-[48px] rounded-xl lg:rounded-xl text-left transition-all border-2 text-sm lg:text-base relative ${
                    isSubmitted
                      ? option.id === currentQuestion.correctAnswer
                        ? 'bg-green-500/15 border-green-500 text-green-300 shadow-lg shadow-green-500/10'
                        : option.id === selectedOption
                        ? 'bg-red-500/15 border-red-500 text-red-300 shadow-lg shadow-red-500/10'
                        : 'bg-slate-800/30 border-slate-700/50 text-slate-500 opacity-60'
                      : selectedOption === option.id
                      ? 'bg-blue-500/15 border-blue-500 text-blue-300 shadow-lg shadow-blue-500/10 scale-[1.02]'
                      : 'bg-slate-800/50 border-slate-700/50 text-slate-200 hover:bg-slate-800/70 hover:border-slate-600 active:bg-slate-700 active:scale-[0.98]'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {/* Indicador de letra */}
                    <div className={`flex-shrink-0 w-6 h-6 lg:w-7 lg:h-7 rounded-full flex items-center justify-center text-xs lg:text-sm font-bold mt-0.5 ${
                      isSubmitted
                        ? option.id === currentQuestion.correctAnswer
                          ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                          : option.id === selectedOption
                          ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                          : 'bg-slate-700/50 text-slate-500 border border-slate-600/50'
                        : selectedOption === option.id
                        ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                        : 'bg-slate-700/50 text-slate-400 border border-slate-600/50'
                    }`}>
                      {String.fromCharCode(65 + index)}
                    </div>
                    <div className="flex-1 flex items-center justify-between gap-2 min-w-0">
                      <span className="flex-1 break-words leading-snug">{option.text}</span>
                      {isSubmitted && option.id === currentQuestion.correctAnswer && (
                        <FontAwesomeIcon icon={faCheck} className="text-green-400 shrink-0 text-lg lg:text-xl ml-2" />
                      )}
                      {isSubmitted && option.id === selectedOption && option.id !== currentQuestion.correctAnswer && (
                        <FontAwesomeIcon icon={faTimes} className="text-red-400 shrink-0 text-lg lg:text-xl ml-2" />
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Explicación */}
            {isSubmitted && currentQuestion.explanation && (
              <div className="mt-3 lg:mt-4 p-3.5 lg:p-4 bg-blue-500/10 border-l-4 border-blue-500 rounded-r-lg lg:rounded-xl">
                <p className="text-xs lg:text-sm text-blue-200 leading-relaxed">
                  <strong className="text-blue-300 block mb-1.5">💡 Explicación:</strong>
                  <span className="block">{currentQuestion.explanation}</span>
                </p>
              </div>
            )}
          </div>

          {/* Feedback & Rewards */}
          {isSubmitted && (
            <div className={`mb-3 lg:mb-6 p-3.5 lg:p-4 rounded-xl lg:rounded-xl text-center border-2 ${
              isCorrect 
                ? 'bg-gradient-to-br from-green-500/15 to-green-600/5 border-green-500/30 shadow-lg shadow-green-500/5' 
                : 'bg-gradient-to-br from-red-500/15 to-red-600/5 border-red-500/30 shadow-lg shadow-red-500/5'
            }`}>
              <div className="flex items-center justify-center gap-2 mb-2">
                {isCorrect ? (
                  <FontAwesomeIcon icon={faCheck} className="text-green-400 text-xl lg:text-2xl" />
                ) : (
                  <FontAwesomeIcon icon={faTimes} className="text-red-400 text-xl lg:text-2xl" />
                )}
                <h5 className={`font-bold text-lg lg:text-xl ${isCorrect ? 'text-green-300' : 'text-red-300'}`}>
                  {isCorrect ? '¡Correcto!' : 'Incorrecto'}
                </h5>
              </div>
              
              {isCorrect && rewards && isLastQuestion && (
                <div className="flex items-center justify-center gap-2.5 lg:gap-4 mt-3 flex-wrap">
                  <div className="flex items-center gap-2 text-yellow-300 font-bold bg-yellow-400/15 px-3 lg:px-4 py-1.5 lg:py-2 rounded-full text-sm lg:text-base border border-yellow-400/20 shadow-md">
                    <FontAwesomeIcon icon={faCoins} className="text-sm lg:text-base" />
                    <span>+{rewards.coins}</span>
                  </div>
                  <div className="flex items-center gap-2 text-blue-300 font-bold bg-blue-400/15 px-3 lg:px-4 py-1.5 lg:py-2 rounded-full text-sm lg:text-base border border-blue-400/20 shadow-md">
                    <FontAwesomeIcon icon={faStar} className="text-sm lg:text-base" />
                    <span>+{rewards.xp} XP</span>
                  </div>
                </div>
              )}
              
              {isCorrect && alreadyCompleted && !rewards && isLastQuestion && (
                <p className="text-slate-300 text-xs lg:text-sm mt-2">
                  Ya has completado esta lección anteriormente.
                </p>
              )}

              {!isCorrect && (
                <p className="text-slate-300 text-xs lg:text-sm mt-2 leading-relaxed px-2">
                  {isLastQuestion ? 'Inténtalo de nuevo para ganar tus recompensas.' : 'Continúa con la siguiente pregunta.'}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Actions - Fixed at bottom */}
        <div className="p-3 lg:p-6 pt-2 lg:pt-0 border-t border-slate-800 shrink-0 bg-slate-900/95 backdrop-blur-sm">
          <div className="flex gap-2 lg:gap-3">
            {/* Botón Anterior */}
            {currentQuestionIndex > 0 && (
              <button
                onClick={handlePreviousQuestion}
                className="cursor-pointer px-3.5 lg:px-4 py-3 min-h-[48px] lg:min-h-[44px] rounded-xl lg:rounded-xl font-bold text-slate-300 bg-slate-800/80 hover:bg-slate-700 active:bg-slate-600 active:scale-95 transition-all shadow-md"
                aria-label="Pregunta anterior"
              >
                <FontAwesomeIcon icon={faArrowLeft} className="text-base lg:text-lg" />
              </button>
            )}

            {/* Botón Cerrar/Cancelar */}
            <button
              onClick={() => {
                // Si se completó el quiz exitosamente, cerrar también el modal de contenido
                if (isLastQuestion && (isCorrect || allQuestionsAnswered) && onComplete) {
                  onComplete();
                } else {
                  onClose();
                }
              }}
              className="cursor-pointer flex-1 py-3 px-3 lg:px-4 min-h-[48px] lg:min-h-[44px] rounded-xl lg:rounded-xl font-semibold text-slate-300 bg-slate-800/80 hover:bg-slate-700 active:bg-slate-600 active:scale-95 transition-all text-sm lg:text-base shadow-md"
            >
              {isLastQuestion && (isCorrect || allQuestionsAnswered) ? 'Cerrar' : 'Cancelar'}
            </button>
            
            {!isSubmitted ? (
              <button
                onClick={handleSubmit}
                disabled={!selectedOption || loading}
                className="cursor-pointer flex-1 py-3 px-3 lg:px-4 min-h-[48px] lg:min-h-[44px] rounded-xl lg:rounded-xl font-bold bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:from-blue-500 hover:to-blue-400 active:from-blue-700 active:to-blue-600 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 text-sm lg:text-base shadow-lg shadow-blue-500/20"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="animate-spin">⏳</span>
                    <span className="hidden lg:inline">Verificando...</span>
                    <span className="lg:hidden">Verificando</span>
                  </span>
                ) : (
                  'Enviar'
                )}
              </button>
            ) : (
              <>
                {!isCorrect && (
                  <button
                    onClick={() => {
                      setIsSubmitted(false);
                      setSelectedOption(null);
                    }}
                    className="cursor-pointer flex-1 py-3 px-3 lg:px-4 min-h-[48px] lg:min-h-[44px] rounded-xl lg:rounded-xl font-bold bg-slate-700 text-white hover:bg-slate-600 active:bg-slate-500 active:scale-95 transition-all text-sm lg:text-base shadow-md"
                  >
                    Reintentar
                  </button>
                )}
                {isCorrect && !isLastQuestion && (
                  <button
                    onClick={handleNextQuestion}
                    className="cursor-pointer flex-1 py-3 px-3 lg:px-4 min-h-[48px] lg:min-h-[44px] rounded-xl lg:rounded-xl font-bold bg-gradient-to-r from-green-600 to-green-500 text-white hover:from-green-500 hover:to-green-400 active:from-green-700 active:to-green-600 active:scale-95 transition-all text-sm lg:text-base shadow-lg shadow-green-500/20"
                  >
                    <span className="hidden lg:inline">Siguiente </span>
                    <span className="lg:hidden">Sig.</span>
                    <FontAwesomeIcon icon={faArrowRight} className="ml-1 lg:ml-2 text-sm lg:text-base" />
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
