'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { cn } from '@/utils/cn';
import { Icon } from '@/shared/components/Icon';

type SignupPageHeaderProps = {
  hasOnboardingAnswers: boolean;
};

export function SignupPageHeader({ hasOnboardingAnswers }: SignupPageHeaderProps) {
  const router = useRouter();

  return (
    <>
      <Link
        href="/login"
        className="text-on-surface-muted hover:text-on-surface-muted mb-6 inline-flex items-center gap-2 transition-colors"
      >
        <Icon name="arrow-left" />
        Volver al login
      </Link>

      {hasOnboardingAnswers && (
        <button
          type="button"
          onClick={() => router.push('/onboarding')}
          className={cn(
            'text-app-accent hover:text-app-accent-muted mb-6 inline-flex cursor-pointer items-center gap-2',
            'text-sm transition-colors'
          )}
        >
          <Icon name="arrow-left" />
          Hacer de nuevo el Cuestionario
        </button>
      )}

      <div className="mb-8 text-center">
        <div
          className={cn(
            'from-cta-from to-cta-to mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full',
            'bg-linear-to-r'
          )}
        >
          <Icon name="rocket" size="2xl" className="text-2xl" />
        </div>
        <h1
          className={cn(
            'from-cta-text-start via-cta-text-via to-cta-text-end mb-2 bg-linear-to-r bg-clip-text text-3xl',
            'font-black text-transparent md:text-4xl'
          )}
        >
          Únete a ICFES Master
        </h1>
        <p className="text-on-surface-muted">
          {hasOnboardingAnswers ? 'Completa tu registro con tus datos' : 'Crea tu cuenta y comienza a prepararte'}
        </p>
      </div>
    </>
  );
}
