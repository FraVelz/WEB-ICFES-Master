'use client';
import { cn } from '@/utils/cn';
import { useState } from 'react';
import Link from 'next/link';
import { Icon } from '@/shared/components/Icon';
import { EMAIL_MESSAGES } from '@/config/emailMessages';
import { AUTH_NOT_CONFIGURED_ALERT } from '@/features/auth/constants/authMessages';

export const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    window.alert(AUTH_NOT_CONFIGURED_ALERT);
  };

  return (
    <div
      className={cn(
        'flex min-h-dvh items-center justify-center overflow-hidden bg-linear-to-b from-black',
        'via-slate-950 to-black px-6 text-white'
      )}
    >
      {/* Background glow effects */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute top-1/3 left-1/4 h-96 w-96 animate-pulse rounded-full bg-blue-500/30 blur-3xl"></div>
        <div className="absolute right-1/4 bottom-1/3 h-96 w-96 animate-pulse rounded-full bg-purple-500/30 blur-3xl"></div>
      </div>

      {/* Card */}
      <div className="relative z-10 w-full max-w-md">
        {/* Back Link */}
        <Link
          href="/login"
          className="mb-8 inline-flex items-center gap-2 text-slate-400 transition-colors hover:text-slate-300"
        >
          <Icon name="arrow-left" />
          Volver al login
        </Link>

        {/* Header */}
        <div className="mb-8 text-center">
          <h1
            className={cn(
              'mb-4 bg-linear-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-3xl',
              'font-black text-transparent md:text-4xl'
            )}
          >
            {EMAIL_MESSAGES.forgotPasswordPage.headerTitle}
          </h1>
          <p className="text-slate-400">{EMAIL_MESSAGES.forgotPasswordPage.headerSubtitle}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-semibold">
              {EMAIL_MESSAGES.forgotPasswordPage.emailLabel}
            </label>
            <div className="relative">
              <Icon name="envelope" className="absolute top-1/2 left-4 -translate-y-1/2 text-slate-400" />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={EMAIL_MESSAGES.forgotPasswordPage.emailPlaceholder}
                className={cn(
                  'w-full rounded-lg border border-slate-700 bg-slate-800/50 py-3 pr-4 pl-10 transition-all',
                  'focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30 focus:outline-none'
                )}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className={cn(
              'w-full cursor-pointer rounded-lg bg-linear-to-r from-cyan-500 to-blue-600 px-4 py-3',
              'font-bold text-white transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/50'
            )}
          >
            {EMAIL_MESSAGES.forgotPasswordPage.buttonText}
          </button>
        </form>
      </div>
    </div>
  );
};
