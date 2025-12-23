import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTimes, faCoins, faStar, faTrophy, faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '@/context/AuthContext';
import GamificationFirestoreService from '@/features/logros/services/GamificationFirestoreService';
import ProgressFirestoreService from '@/features/progress/services/ProgressFirestoreService';

export const LessonQuizModal = ({ isOpen, onClose, questions, quiz, lessonId, lessonTitle, lessonXp, lessonCoins }) => {
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

  // Normalizar preguntas: convertir questions array a formato compatible o usar quiz
  const normalizedQuestions = React.useMemo(() => {
    if (questions && Array.isArray(questions) && questions.length > 0) {
      // Convertir estructura de questions (con options como array de strings y correct_answer como índice)
      return questions.map((q, index) => {
        // Si options es array de strings, convertir a formato {id, text}
        const options = Array.isArray(q.options) && q.options.length > 0
          ? (typeof q.options[0] === 'string'
              ? q.options.map((opt, i) => ({ id: String.fromCharCode(97 + i), text: opt }))
              : q.options.map((opt, i) => ({ id: opt.id || String.fromCharCode(97 + i), text: opt.text || opt })))
          : [];
        
        // Convertir correct_answer (índice) a correctAnswer (id)
        const correctAnswerIndex = typeof q.correct_answer === 'number' ? q.correct_answer : 
                                   typeof q.correctAnswer === 'number' ? q.correctAnswer : 0;
        const correctAnswer = options[correctAnswerIndex]?.id || options[0]?.id || 'a';

        return {
          id: q.id || `question_${index}`,
          question: q.question || q.text || '',
          options: options,
          correctAnswer: correctAnswer,
          explanation: q.explanation || '',
          difficulty: q.difficulty || 'media'
        };
      });
    } else if (quiz) {
      // Formato antiguo: quiz único
      return [{
        id: 'quiz_1',
        question: quiz.question || '',
        options: quiz.options || [],
        correctAnswer: quiz.correctAnswer || '',
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
      const completedLessons = await ProgressFirestoreService.getCompletedLessons(user.uid);
      if (completedLessons.includes(lessonId)) {
        setAlreadyCompleted(true);
      } else {
        setAlreadyCompleted(false);
      }
    } catch (error) {
      console.error('Error checking completion status:', error);
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

    // Verificar si todas las preguntas están correctas (incluyendo la actual)
    const allCorrect = normalizedQuestions.every(q => {
      const answer = updatedAnswers[q.id];
      return answer === q.correctAnswer;
    });

    // Si es la última pregunta y todas están correctas, otorgar recompensas
    if (isLastQuestion && allCorrect && !alreadyCompleted) {
      setLoading(true);
      try {
        // Otorgar recompensas solo si todas las preguntas están correctas
        const xpAmount = lessonXp || quiz?.rewards?.xp || 10;
        const coinsAmount = lessonCoins || quiz?.rewards?.coins || 5;

        await GamificationFirestoreService.addXP(user.uid, xpAmount, `lesson_quiz_${lessonId}`);
        await GamificationFirestoreService.addCoins(user.uid, coinsAmount, `lesson_quiz_${lessonId}`);
        await ProgressFirestoreService.markLessonAsCompleted(user.uid, lessonId);

        setRewards({ xp: xpAmount, coins: coinsAmount });
        setAlreadyCompleted(true);
      } catch (error) {
        console.error('Error awarding rewards:', error);
      }
      setLoading(false);
    } else if (totalQuestions === 1 && correct && !alreadyCompleted) {
      // Si solo hay una pregunta y está correcta, otorgar recompensas inmediatamente
      setLoading(true);
      try {
        const xpAmount = lessonXp || quiz?.rewards?.xp || 10;
        const coinsAmount = lessonCoins || quiz?.rewards?.coins || 5;

        await GamificationFirestoreService.addXP(user.uid, xpAmount, `lesson_quiz_${lessonId}`);
        await GamificationFirestoreService.addCoins(user.uid, coinsAmount, `lesson_quiz_${lessonId}`);
        await ProgressFirestoreService.markLessonAsCompleted(user.uid, lessonId);

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
    <div className="fixed inset-0 z-[70] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl transform transition-all scale-100">
        
        {/* Header */}
        <div className="bg-slate-800/50 p-6 border-b border-slate-800">
          <h3 className="text-xl font-bold text-white text-center">
            <FontAwesomeIcon icon={faTrophy} className="text-yellow-400 mr-2" />
            Prueba de Conocimiento
          </h3>
          <p className="text-slate-400 text-center text-sm mt-1">
            {lessonTitle}
          </p>
          {totalQuestions > 1 && (
            <div className="text-center mt-2">
              <span className="text-xs text-slate-500">
                Pregunta {currentQuestionIndex + 1} de {totalQuestions}
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="mb-6">
            <h4 className="text-lg text-white font-medium mb-4">
              {currentQuestion.question}
            </h4>
            
            <div className="space-y-3">
              {currentQuestion.options.map((option) => (
                <button
                  key={option.id}
                  onClick={() => !isSubmitted && setSelectedOption(option.id)}
                  disabled={isSubmitted}
                  className={`w-full p-4 rounded-xl text-left transition-all border-2 ${
                    isSubmitted
                      ? option.id === currentQuestion.correctAnswer
                        ? 'bg-green-500/10 border-green-500 text-green-400'
                        : option.id === selectedOption
                        ? 'bg-red-500/10 border-red-500 text-red-400'
                        : 'bg-slate-800/50 border-transparent text-slate-400 opacity-50'
                      : selectedOption === option.id
                      ? 'bg-blue-500/10 border-blue-500 text-blue-400'
                      : 'bg-slate-800/50 border-transparent text-slate-300 hover:bg-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{option.text}</span>
                    {isSubmitted && option.id === currentQuestion.correctAnswer && (
                      <FontAwesomeIcon icon={faCheck} className="text-green-500" />
                    )}
                    {isSubmitted && option.id === selectedOption && option.id !== currentQuestion.correctAnswer && (
                      <FontAwesomeIcon icon={faTimes} className="text-red-500" />
                    )}
                  </div>
                </button>
              ))}
            </div>

            {/* Explicación */}
            {isSubmitted && currentQuestion.explanation && (
              <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                <p className="text-sm text-blue-300">
                  <strong className="text-blue-400">Explicación:</strong> {currentQuestion.explanation}
                </p>
              </div>
            )}
          </div>

          {/* Feedback & Rewards */}
          {isSubmitted && (
            <div className={`mb-6 p-4 rounded-xl text-center ${
              isCorrect ? 'bg-green-500/10 border border-green-500/20' : 'bg-red-500/10 border border-red-500/20'
            }`}>
              <h5 className={`font-bold text-lg mb-1 ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
                {isCorrect ? '¡Correcto!' : 'Incorrecto'}
              </h5>
              
              {isCorrect && rewards && isLastQuestion && (
                <div className="flex items-center justify-center gap-4 mt-3">
                  <div className="flex items-center gap-2 text-yellow-400 font-bold bg-yellow-400/10 px-3 py-1 rounded-full">
                    <FontAwesomeIcon icon={faCoins} />
                    +{rewards.coins}
                  </div>
                  <div className="flex items-center gap-2 text-blue-400 font-bold bg-blue-400/10 px-3 py-1 rounded-full">
                    <FontAwesomeIcon icon={faStar} />
                    +{rewards.xp} XP
                  </div>
                </div>
              )}
              
              {isCorrect && alreadyCompleted && !rewards && isLastQuestion && (
                <p className="text-slate-400 text-sm mt-2">
                  Ya has completado esta lección anteriormente.
                </p>
              )}

              {!isCorrect && (
                <p className="text-slate-400 text-sm mt-2">
                  {isLastQuestion ? 'Inténtalo de nuevo para ganar tus recompensas.' : 'Continúa con la siguiente pregunta.'}
                </p>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            {/* Botón Anterior */}
            {currentQuestionIndex > 0 && (
              <button
                onClick={handlePreviousQuestion}
                className="px-4 py-3 rounded-xl font-bold text-slate-400 hover:bg-slate-800 transition-colors"
              >
                <FontAwesomeIcon icon={faArrowLeft} />
              </button>
            )}

            {/* Botón Cerrar/Cancelar */}
            <button
              onClick={onClose}
              className={`${currentQuestionIndex > 0 ? 'flex-1' : 'flex-1'} py-3 px-4 rounded-xl font-bold text-slate-400 hover:bg-slate-800 transition-colors`}
            >
              {isLastQuestion && (isCorrect || allQuestionsAnswered) ? 'Cerrar' : 'Cancelar'}
            </button>
            
            {!isSubmitted ? (
              <button
                onClick={handleSubmit}
                disabled={!selectedOption || loading}
                className="flex-1 py-3 px-4 rounded-xl font-bold bg-blue-600 text-white hover:bg-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Verificando...' : 'Enviar Respuesta'}
              </button>
            ) : (
              <>
                {!isCorrect && (
                  <button
                    onClick={() => {
                      setIsSubmitted(false);
                      setSelectedOption(null);
                    }}
                    className="flex-1 py-3 px-4 rounded-xl font-bold bg-slate-700 text-white hover:bg-slate-600 transition-colors"
                  >
                    Intentar de nuevo
                  </button>
                )}
                {isCorrect && !isLastQuestion && (
                  <button
                    onClick={handleNextQuestion}
                    className="flex-1 py-3 px-4 rounded-xl font-bold bg-green-600 text-white hover:bg-green-500 transition-colors"
                  >
                    Siguiente <FontAwesomeIcon icon={faArrowRight} className="ml-2" />
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
