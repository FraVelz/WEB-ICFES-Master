'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { OnboardingLayout } from './OndboardingLayout';

import { Icon } from '@/shared/components/Icon';
import { MascotaCircle } from '@/shared/components/MascotaCircle';

import { INTRODUCTION_SECTIONS, ONBOARDING_QUESTIONS } from './data';

interface OnboardingQuestion {
  id: number;
  question: string;
  type: string;
  options: { value: string; label: string }[];
}

interface OnboardingQuizProps {
  onComplete: (answers: Record<string, unknown>) => void;
  avatarConfig?: { intro1?: string; intro2?: string };
}

export const OnboardingQuiz = ({
  onComplete,
  avatarConfig = {},
}: OnboardingQuizProps) => {
  const router = useRouter();
  const [stage, setStage] = useState('intro'); // 'intro', 'quiz', 'completed'
  const [introIndex, setIntroIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, unknown>>({});

  // Configuración de avatares - permitir personalización
  const avatarSettings = {
    intro1: avatarConfig.intro1 ?? '/avatars/logo.webp',
    intro2: avatarConfig.intro2 ?? '/avatars/logo.webp',
  };

  const currentQuestion = (ONBOARDING_QUESTIONS as OnboardingQuestion[])[
    currentQuestionIndex
  ];
  const isMultiple = currentQuestion?.type === 'multiple';
  const rawAnswer = currentQuestion
    ? answers[String(currentQuestion.id)]
    : undefined;
  const currentAnswer: string | string[] =
    typeof rawAnswer === 'string' || Array.isArray(rawAnswer)
      ? rawAnswer
      : isMultiple
        ? []
        : '';
  const progress =
    ((currentQuestionIndex + 1) / ONBOARDING_QUESTIONS.length) * 100;

  const handleSelectOption = (value: string) => {
    if (isMultiple && currentQuestion) {
      const currentAnswers = Array.isArray(currentAnswer) ? currentAnswer : [];
      setAnswers((prev) => ({
        ...prev,
        [String(currentQuestion.id)]: currentAnswers.includes(value)
          ? currentAnswers.filter((v) => v !== value)
          : [...currentAnswers, value],
      }));
    } else if (currentQuestion) {
      setAnswers((prev) => ({
        ...prev,
        [String(currentQuestion.id)]: value,
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
        <div className="flex flex-1 flex-col items-center justify-center px-6 py-8">
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
        </div>

        {/* Bottom Section - Button */}
        <div className="mx-auto w-full max-w-md px-6 pb-8">
          <button
            onClick={handleIntroNext}
            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-linear-to-r from-cyan-500 to-blue-600 px-6 py-4 text-lg font-bold text-white transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/50"
          >
            <span>Continuar</span>
            <Icon name="arrow-right" />
          </button>
        </div>
      </OnboardingLayout>
    );
  }

  if (stage === 'completed') {
    return (
      <OnboardingLayout className="items-center justify-center">
        <div className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center space-y-8 px-6 py-12 text-center">
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
        </div>
      </OnboardingLayout>
    );
  }

  return (
    <OnboardingLayout>
      {/* Header & Progress - Sticky Top */}
      <div className="sticky top-0 z-30 border-b border-slate-800 bg-slate-950/95 shadow-lg backdrop-blur-md">
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
      </div>

      {/* Main Content - Scrollable Area */}
      <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-8 px-4 py-8">
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
                    ? (Array.isArray(currentAnswer)
                        ? currentAnswer
                        : []
                      ).includes(option.value)
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
                      ? (Array.isArray(currentAnswer)
                          ? currentAnswer
                          : []
                        ).includes(option.value)
                      : currentAnswer === option.value
                  )
                    ? 'scale-110 border-cyan-500 bg-cyan-500'
                    : 'border-slate-600 group-hover:border-slate-400'
                }`}
              >
                {(isMultiple
                  ? (Array.isArray(currentAnswer)
                      ? currentAnswer
                      : []
                    ).includes(option.value)
                  : currentAnswer === option.value) && (
                  <span className="text-sm font-bold text-white">✓</span>
                )}
              </div>
              <span className="text-base sm:text-lg">{option.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Footer Actions */}
      <div className="z-20 mx-auto w-full max-w-4xl p-6 pt-2">
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
      </div>
    </OnboardingLayout>
  );
};
