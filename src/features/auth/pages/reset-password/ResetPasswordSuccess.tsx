'use client';

import Link from 'next/link';
import { cn } from '@/utils/cn';
import { Icon } from '@/shared/components/Icon';
import { EMAIL_MESSAGES } from '@/config/emailMessages';

export function ResetPasswordSuccess() {
  return (
    <div className="space-y-6 text-center">
      <div className="mb-6 flex justify-center">
        <div
          className={cn(
            'bg-lesson-sci-glow-a/20 flex h-20 w-20 animate-pulse items-center justify-center rounded-full',
            'border border-green-500/50'
          )}
        >
          <Icon name="check-circle" size="2xl" className="text-4xl text-green-400" />
        </div>
      </div>

      <div>
        <h1
          className={cn(
            'via-app-accent mb-4 bg-linear-to-r from-green-400 to-blue-400 bg-clip-text text-3xl',
            'font-black text-transparent md:text-4xl'
          )}
        >
          {EMAIL_MESSAGES.resetPasswordPage.successTitle}
        </h1>
        <p className="text-slate-400">{EMAIL_MESSAGES.resetPasswordPage.successMessage}</p>
      </div>

      <Link
        href="/login"
        className={cn(
          'from-cta-from to-cta-to block rounded-lg bg-linear-to-r px-4 py-3 text-center font-bold',
          'hover:shadow-app-ring/50 text-white transition-all hover:shadow-lg'
        )}
      >
        {EMAIL_MESSAGES.resetPasswordPage.goToLoginButton}
      </Link>
    </div>
  );
}
