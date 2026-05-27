'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { INTRODUCTION_SECTIONS, ONBOARDING_QUESTIONS } from './data';
import { OnboardingIntroStage } from './OnboardingIntroStage';
import { OnboardingQuizStage } from './OnboardingQuizStage';
import { OnboardingCompleteStage } from './OnboardingCompleteStage';

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

export const OnboardingQuiz = ({ onComplete, avatarConfig = {} }: OnboardingQuizProps) => {
  const router = useRouter();
  const [stage, setStage] = useState<'intro' | 'quiz' | 'completed'>('intro');
  const [introIndex, setIntroIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, unknown>>({});

  const avatarSettings = {
    intro1: avatarConfig.intro1 ?? '/avatars/logo.webp',
    intro2: avatarConfig.intro2 ?? '/avatars/logo.webp',
  };

  const currentQuestion = (ONBOARDING_QUESTIONS as OnboardingQuestion[])[currentQuestionIndex];
  const isMultiple = currentQuestion?.type === 'multiple';
  const rawAnswer = currentQuestion ? answers[String(currentQuestion.id)] : undefined;
  const currentAnswer: string | string[] =
    typeof rawAnswer === 'string' || Array.isArray(rawAnswer) ? rawAnswer : isMultiple ? [] : '';
  const progress = ((currentQuestionIndex + 1) / ONBOARDING_QUESTIONS.length) * 100;

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
      setAnswers((prev) => ({ ...prev, [String(currentQuestion.id)]: value }));
    }
  };

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
      setStage('intro');
      setIntroIndex(INTRODUCTION_SECTIONS.length - 1);
    }
  };

  const canProceed = isMultiple ? Array.isArray(currentAnswer) && currentAnswer.length > 0 : currentAnswer !== '';

  if (stage === 'intro') {
    const currentIntro = INTRODUCTION_SECTIONS[introIndex];
    return (
      <OnboardingIntroStage
        message={currentIntro.message}
        description={currentIntro.description}
        avatarSrc={introIndex === 0 ? avatarSettings.intro1 : avatarSettings.intro2}
        onBack={handleIntroBack}
        onNext={handleIntroNext}
      />
    );
  }

  if (stage === 'completed') {
    return <OnboardingCompleteStage onContinue={() => onComplete(answers)} />;
  }

  return (
    <OnboardingQuizStage
      question={currentQuestion.question}
      options={currentQuestion.options}
      isMultiple={isMultiple}
      currentAnswer={currentAnswer}
      progress={progress}
      questionIndex={currentQuestionIndex}
      totalQuestions={ONBOARDING_QUESTIONS.length}
      canProceed={canProceed}
      onBack={handleQuizBack}
      onSelectOption={handleSelectOption}
      onNext={handleNext}
    />
  );
};
