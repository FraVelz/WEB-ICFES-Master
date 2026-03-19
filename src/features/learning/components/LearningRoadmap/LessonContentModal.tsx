import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Icon } from '@/shared/components/Icon';
import { LessonQuizModal } from './LessonQuizModal';

export const LessonContentModal = ({ isOpen, onClose, lesson }) => {
  const [isQuizOpen, setIsQuizOpen] = useState(false);

  // Normalizar preguntas: puede venir como questions (array) o quiz (objeto único)
  const hasQuestions = lesson?.questions && Array.isArray(lesson.questions) && lesson.questions.length > 0;
  const hasQuiz = lesson?.quiz && typeof lesson.quiz === 'object';
  const canShowQuiz = hasQuestions || hasQuiz;

  if (!isOpen || !lesson) return null;

  // Extraer contenido como string (evitar error si content es objeto)
  const contentStr = typeof lesson.content === 'string' ? lesson.content : '';
  const hasContent = contentStr.trim().length > 0;

  return (
    <div className="fixed inset-0 z-60 bg-slate-950 flex flex-col animate-in slide-in-from-bottom duration-300 w-full h-full">
      {/* Header */}
      <div className="flex items-center p-4 border-b border-slate-800 bg-slate-900/95 backdrop-blur-md shrink-0">
        <button 
          onClick={onClose}
          className="p-2 -ml-2 text-slate-400 hover:text-white transition-colors rounded-full hover:bg-slate-800 cursor-pointer"
        >
          <Icon name="arrow-left" className="text-lg" />
        </button>
        <h2 className="ml-3 text-lg font-bold text-white truncate flex-1">
          {lesson.title}
        </h2>
      </div>

      {/* Content - Scrollable */}
      <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden scroll-smooth p-5 sm:p-8">
        <div className="max-w-3xl mx-auto pb-32">
           <ReactMarkdown
            components={{
              h1: ({node, ...props}) => <h1 className="text-3xl font-bold text-white mb-6 mt-8" {...props} />,
              h2: ({node, ...props}) => <h2 className="text-2xl font-bold text-blue-400 mb-4 mt-8 border-b border-slate-800 pb-2" {...props} />,
              h3: ({node, ...props}) => <h3 className="text-xl font-bold text-green-400 mb-3 mt-6" {...props} />,
              p: ({node, ...props}) => <p className="text-slate-300 leading-relaxed mb-4 text-lg" {...props} />,
              ul: ({node, ...props}) => <ul className="list-disc list-inside text-slate-300 mb-4 space-y-2" {...props} />,
              ol: ({node, ...props}) => <ol className="list-decimal list-inside text-slate-300 mb-4 space-y-2" {...props} />,
              li: ({node, ...props}) => <li className="ml-4" {...props} />,
              blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-blue-500 pl-4 italic text-slate-400 my-4 bg-slate-900/50 p-4 rounded-r-lg" {...props} />,
              code: ({node, inline, className, children, ...props}) => {
                return inline ? (
                  <code className="bg-slate-800 text-pink-400 px-1.5 py-0.5 rounded text-sm font-mono" {...props}>
                    {children}
                  </code>
                ) : (
                  <div className="bg-slate-900 rounded-lg p-4 my-4 overflow-x-auto border border-slate-800">
                    <code className="text-slate-200 font-mono text-sm" {...props}>
                      {children}
                    </code>
                  </div>
                );
              },
              a: ({node, ...props}) => <a className="text-blue-400 hover:text-blue-300 underline decoration-blue-400/30 hover:decoration-blue-300" {...props} />,
              img: ({node, ...props}) => <img className="rounded-xl shadow-lg my-6 max-w-full h-auto border border-slate-800" {...props} />,
            }}
           >
             {contentStr || '_No hay contenido disponible para esta lección._'}
           </ReactMarkdown>

           {/* Quiz Section - Siempre mostrar si hay contenido */}
           {hasContent && (
             <div className="mt-12 pt-8 border-t border-slate-800">
               <h3 className="text-xl font-bold text-white mb-4">¿Listo para ponerte a prueba?</h3>
               <p className="text-slate-400 mb-6">
                 {canShowQuiz ? (
                   <>
                     Completa {hasQuestions ? `las ${lesson.questions.length} pregunta${lesson.questions.length > 1 ? 's' : ''}` : 'el examen rápido'}, para finalizar esta lección y ganar <span className="text-blue-400 font-bold">{lesson.xp || lesson.quiz?.rewards?.xp || 10} XP</span> y <span className="text-yellow-400 font-bold">{lesson.coins || lesson.quiz?.rewards?.coins || 5} monedas</span>.
                   </>
                 ) : (
                   <>
                     Completa el examen rápido para finalizar esta lección y ganar <span className="text-blue-400 font-bold">{lesson.xp || 10} XP</span> y <span className="text-yellow-400 font-bold">{lesson.coins || 5} monedas</span>.
                   </>
                 )}
               </p>
               <button
                 onClick={() => setIsQuizOpen(true)}
                 className="cursor-pointer w-full sm:w-auto px-8 py-4 bg-linear-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
               >
                 Realizar Prueba
               </button>
             </div>
           )}
        </div>
      </div>
      
      {/* Quiz Modal - Fuera del contenedor de contenido para que funcione como overlay */}
      <LessonQuizModal 
        isOpen={isQuizOpen} 
        onClose={() => setIsQuizOpen(false)}
        onComplete={() => {
          setIsQuizOpen(false);
          onClose(); // Cerrar también el modal de contenido
        }}
        questions={lesson.questions}
        quiz={lesson.quiz}
        lessonId={lesson.id}
        lessonTitle={lesson.title}
        lessonXp={lesson.xp}
        lessonCoins={lesson.coins}
      />
    </div>
  );
};
