'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Icon } from '@/shared/components/Icon';
import { MascotaCircle } from '@/shared/components/MascotaCircle';

// Secciones de introducción
const INTRODUCTION_SECTIONS = [
  {
    id: 1,
    message: '¡Hola!, Yo soy Zeus.',
    avatar: '/avatars/logo.webp', // Avatar con libro o presentación
    description: 'Tu asistente de estudio',
  },
  {
    id: 2,
    message: '¡Responde 5 preguntas cortas antes de comenzar!',
    avatar: '/avatars/logo.webp', // Avatar saludando
    description: 'Personalizaremos tu experiencia.',
  },
];

// Preguntas del cuestionario de onboarding
const ONBOARDING_QUESTIONS = [
  {
    id: 1,
    question: '¿Cuál es tu objetivo principal?',
    type: 'single',
    options: [
      { value: 'pass', label: 'Pasar el ICFES' },
      { value: 'excel', label: 'Obtener un puntaje excelente' },
      { value: 'prepare', label: 'Prepararme a mi propio ritmo' },
      { value: 'improve', label: 'Mejorar mis debilidades' },
    ],
  },
  {
    id: 2,
    question: '¿En cuánto tiempo planeas presentar el ICFES?',
    type: 'single',
    options: [
      { value: 'less_month', label: 'Menos de 1 mes' },
      { value: '1_3_months', label: '1 a 3 meses' },
      { value: '3_6_months', label: '3 a 6 meses' },
      { value: 'more_6_months', label: 'Más de 6 meses' },
    ],
  },
  {
    id: 3,
    question: '¿Cuál es tu nivel actual?',
    type: 'single',
    options: [
      { value: 'beginner', label: 'Principiante (nunca he practicado)' },
      {
        value: 'intermediate',
        label: 'Intermedio (tengo algo de experiencia)',
      },
      { value: 'advanced', label: 'Avanzado (ya he practicado bastante)' },
    ],
  },
  {
    id: 4,
    question: '¿Cuáles son tus áreas débiles? (selecciona 1 o más)',
    type: 'multiple',
    options: [
      { value: 'math', label: 'Matemáticas' },
      { value: 'language', label: 'Lenguaje' },
      { value: 'science', label: 'Ciencias Naturales' },
      { value: 'social', label: 'Ciencias Sociales' },
      { value: 'english', label: 'Inglés' },
      { value: 'none', label: 'Me desempeño bien en todo' },
    ],
  },
  {
    id: 5,
    question: '¿Cuánto tiempo disponible tienes para estudiar diariamente?',
    type: 'single',
    options: [
      { value: 'less_30m', label: 'Menos de 30 minutos' },
      { value: '30m_1h', label: '30 minutos a 1 hora' },
      { value: '1h_2h', label: '1 a 2 horas' },
      { value: 'more_2h', label: 'Más de 2 horas' },
    ],
  },
];

// Componente de Layout reutilizable para mantener consistencia
const OnboardingLayout = ({ children, className = '' }) => (
  <div
    className={`relative flex min-h-dvh flex-col bg-linear-to-b from-black via-slate-950 to-black text-white ${className}`}
  >
    {/* Background glow effects - Fixed position */}
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div className="absolute top-1/3 left-1/4 h-96 w-96 animate-pulse rounded-full bg-blue-500/30 blur-3xl"></div>
      <div className="absolute right-1/4 bottom-1/3 h-96 w-96 animate-pulse rounded-full bg-purple-500/30 blur-3xl"></div>
    </div>
    {/* Content wrapper */}
    <div className="relative z-10 flex w-full flex-1 flex-col">{children}</div>
  </div>
);

export const OnboardingQuiz = ({ onComplete, avatarConfig = {} }) => {
  const router = useRouter();
  const [stage, setStage] = useState('intro'); // 'intro', 'quiz', 'completed'
  const [introIndex, setIntroIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});

  // Configuración de avatares - permitir personalización
  const avatarSettings = {
    intro1: avatarConfig.intro1 || '/avatars/logo.webp',
    intro2: avatarConfig.intro2 || '/avatars/logo.webp',
  };

  const currentQuestion = ONBOARDING_QUESTIONS[currentQuestionIndex];
  const isMultiple = currentQuestion?.type === 'multiple';
  const currentAnswer = answers[currentQuestion?.id] || (isMultiple ? [] : '');
  const progress =
    ((currentQuestionIndex + 1) / ONBOARDING_QUESTIONS.length) * 100;

  const handleSelectOption = (value) => {
    if (isMultiple) {
      const currentAnswers = Array.isArray(currentAnswer) ? currentAnswer : [];
      setAnswers((prev) => ({
        ...prev,
        [currentQuestion.id]: currentAnswers.includes(value)
          ? currentAnswers.filter((v) => v !== value)
          : [...currentAnswers, value],
      }));
    } else {
      setAnswers((prev) => ({
        ...prev,
        [currentQuestion.id]: value,
      }));
    }
  };

  // Navegación de introducciones
  const handleIntroNext = () => {
    if (introIndex < INTRODUCTION_SECTIONS.length - 1) {
      setIntroIndex((prev) => prev + 1);
    } else {
      setStage('quiz');
      setIntroIndex(0);
    }
  };

  const handleIntroBack = () => {
    if (introIndex > 0) {
      setIntroIndex((prev) => prev - 1);
    } else {
      router.push('/');
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < ONBOARDING_QUESTIONS.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      setStage('completed');
    }
  };

  const handleQuizBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    } else {
      // Volver a la introducción
      setStage('intro');
      setIntroIndex(INTRODUCTION_SECTIONS.length - 1);
    }
  };

  const handleContinue = () => {
    onComplete(answers);
  };

  const canProceed = isMultiple
    ? Array.isArray(currentAnswer) && currentAnswer.length > 0
    : currentAnswer !== '';

  // Pantalla de Introducción (Secciones 1 y 2)
  if (stage !== 'quiz' && stage !== 'completed') {
    const currentIntro = INTRODUCTION_SECTIONS[introIndex];
    const avatarSrc =
      introIndex === 0 ? avatarSettings.intro1 : avatarSettings.intro2;

    return (
      <OnboardingLayout>
        {/* Header */}
        <div className="flex h-16 items-center px-6">
          <button
            onClick={handleIntroBack}
            className="cursor-pointer rounded-lg p-2 transition-all duration-200 hover:bg-slate-800"
            title="Volver atrás"
          >
            <Icon name="chevron-left" className="text-xl text-cyan-400" />
          </button>
        </div>

        {/* Main Content */}
        <main className="flex flex-1 flex-col items-center justify-center px-6 py-8">
          {/* Avatar */}
          <MascotaCircle
            src={avatarSrc}
            size="large"
            alt="Zeus - Tu asistente"
            className="mb-8"
          />

          {/* Message */}
          <div className="w-full max-w-2xl rounded-lg border border-slate-700 bg-slate-800/50 p-8 text-center backdrop-blur-sm">
            <h2 className="mb-2 bg-linear-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-2xl font-bold text-transparent md:text-3xl">
              {currentIntro.message}
            </h2>
            <p className="text-sm text-slate-300">{currentIntro.description}</p>
          </div>
        </main>

        {/* Bottom Section - Button */}
        <footer className="mx-auto w-full max-w-md px-6 pb-8">
          <button
            onClick={handleIntroNext}
            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-linear-to-r from-cyan-500 to-blue-600 px-6 py-4 text-lg font-bold text-white transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/50"
          >
            <span>Continuar</span>
            <Icon name="arrow-right" />
          </button>
        </footer>
      </OnboardingLayout>
    );
  }

  if (stage === 'completed') {
    return (
      <OnboardingLayout className="items-center justify-center">
        <main className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center space-y-8 px-6 py-12 text-center">
          <div className="mx-auto inline-flex h-24 w-24 items-center justify-center rounded-full bg-linear-to-r from-green-500 to-emerald-600 shadow-lg shadow-green-500/30">
            <Icon name="check-circle" className="text-5xl" />
          </div>

          <div className="space-y-4">
            <h2 className="bg-linear-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-3xl font-black text-transparent md:text-4xl">
              ¡Perfecto!
            </h2>

            <p className="text-lg text-slate-300">
              Hemos entendido tus necesidades. Ahora crearemos tu cuenta
              personalizada con un plan adaptado a ti.
            </p>
          </div>

          <button
            onClick={handleContinue}
            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-linear-to-r from-cyan-500 to-blue-600 px-6 py-4 text-lg font-bold text-white transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/50"
          >
            <Icon name="arrow-right" />
            Ir al Registro
          </button>
        </main>
      </OnboardingLayout>
    );
  }

  return (
    <OnboardingLayout>
      {/* Header & Progress - Sticky Top */}
      <header className="sticky top-0 z-30 border-b border-slate-800 bg-slate-950/95 shadow-lg backdrop-blur-md">
        <div className="flex h-16 items-center justify-between px-6">
          <button
            onClick={handleQuizBack}
            className="cursor-pointer rounded-lg p-2 transition-all duration-200 hover:bg-slate-800"
            title="Volver atrás"
          >
            <Icon name="chevron-left" className="text-xl text-cyan-400" />
          </button>
          <div className="flex flex-1 items-center justify-center gap-6">
            <h3 className="hidden text-sm font-semibold text-slate-400 sm:block">
              Pregunta {currentQuestionIndex + 1} de{' '}
              {ONBOARDING_QUESTIONS.length}
            </h3>
            <span className="text-sm font-semibold text-cyan-400">
              {Math.round(progress)}%
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="px-6 py-0">
          <div className="h-1 w-full overflow-hidden rounded-full bg-slate-800">
            <div
              className="h-full bg-linear-to-r from-cyan-500 to-blue-600 transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      </header>

      {/* Main Content - Scrollable Area */}
      <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-8 px-4 py-8">
        {/* Question + Avatar */}
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
          <div className="shrink-0">
            <MascotaCircle
              src="/avatars/pensativo.webp"
              size="medium"
              alt="Zeus - Tu asistente"
              centered={false}
            />
          </div>
          <div className="flex-1 pt-2 text-center sm:text-left">
            <h2 className="text-xl leading-tight font-bold text-white sm:text-2xl md:text-3xl">
              {currentQuestion.question}
            </h2>
          </div>
        </div>

        {/* Options List */}
        <div className="w-full space-y-3">
          {currentQuestion.options.map((option) => (
            <button
              key={option.value}
              onClick={() => handleSelectOption(option.value)}
              className={`group flex w-full cursor-pointer items-center gap-4 rounded-xl border-2 p-4 text-left font-semibold transition-all duration-200 ${
                (
                  isMultiple
                    ? currentAnswer.includes(option.value)
                    : currentAnswer === option.value
                )
                  ? 'border-cyan-500 bg-cyan-500/20 text-white shadow-lg shadow-cyan-500/10'
                  : 'border-slate-700 bg-slate-800/50 text-slate-300 hover:border-slate-500 hover:bg-slate-800'
              }`}
            >
              <div
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded border-2 transition-all ${
                  (
                    isMultiple
                      ? currentAnswer.includes(option.value)
                      : currentAnswer === option.value
                  )
                    ? 'scale-110 border-cyan-500 bg-cyan-500'
                    : 'border-slate-600 group-hover:border-slate-400'
                }`}
              >
                {(isMultiple
                  ? currentAnswer.includes(option.value)
                  : currentAnswer === option.value) && (
                  <span className="text-sm font-bold text-white">✓</span>
                )}
              </div>
              <span className="text-base sm:text-lg">{option.label}</span>
            </button>
          ))}
        </div>
      </main>

      {/* Footer Actions */}
      <footer className="z-20 mx-auto w-full max-w-4xl p-6 pt-2">
        <button
          onClick={handleNext}
          disabled={!canProceed}
          className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-linear-to-r from-cyan-500 to-blue-600 px-6 py-4 text-lg font-bold text-white shadow-md transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {currentQuestionIndex === ONBOARDING_QUESTIONS.length - 1 ? (
            <>
              Finalizar
              <Icon name="check-circle" />
            </>
          ) : (
            <>
              Continuar
              <Icon name="arrow-right" />
            </>
          )}
        </button>
      </footer>
    </OnboardingLayout>
  );
};
