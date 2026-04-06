'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { OnboardingQuiz } from '../components/OnboardingQuiz/OnboardingQuiz';

export const OnboardingPage = () => {
  const router = useRouter();
  const [quizAnswers, setQuizAnswers] = useState<Record<string, unknown> | null>(null);

  // Avatar URLs for intro screens (edit paths here)
  const avatarConfig = {
    intro1: '/avatars/logo.webp', // Intro 1
    intro2: '/avatars/logo.webp', // Intro 2
  };

  const handleQuizComplete = (answers: Record<string, unknown>) => {
    // Stash quiz answers for signup prefill
    sessionStorage.setItem('onboardingAnswers', JSON.stringify(answers));
    setQuizAnswers(answers);
    // Short delay before navigating to signup
    setTimeout(() => {
      router.push('/signup');
    }, 1000);
  };

  return <OnboardingQuiz onComplete={handleQuizComplete} avatarConfig={avatarConfig} />;
};
