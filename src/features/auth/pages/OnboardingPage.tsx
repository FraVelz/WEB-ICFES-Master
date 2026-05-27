'use client';

import { useRouter } from 'next/navigation';
import { OnboardingQuiz } from '../components/OnboardingQuiz/OnboardingQuiz';

export const OnboardingPage = () => {
  const router = useRouter();

  const avatarConfig = {
    intro1: '/avatars/logo.webp',
    intro2: '/avatars/logo.webp',
  };

  const handleQuizComplete = (answers: Record<string, unknown>) => {
    sessionStorage.setItem('onboardingAnswers', JSON.stringify(answers));
    setTimeout(() => {
      router.push('/signup');
    }, 1000);
  };

  return <OnboardingQuiz onComplete={handleQuizComplete} avatarConfig={avatarConfig} />;
};
