'use client';

import { useRouter } from 'next/navigation';
import { OnboardingQuiz } from '../components/OnboardingQuiz/OnboardingQuiz';

export const OnboardingPage = () => {
  const router = useRouter();

  const handleQuizComplete = (answers: Record<string, unknown>) => {
    sessionStorage.setItem('onboardingAnswers', JSON.stringify(answers));
    setTimeout(() => {
      router.push('/signup');
    }, 1000);
  };

  return <OnboardingQuiz onComplete={handleQuizComplete} />;
};
