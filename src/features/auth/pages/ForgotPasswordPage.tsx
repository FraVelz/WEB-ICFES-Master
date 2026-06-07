'use client';
import { cn } from '@/utils/cn';
import { useState } from 'react';
import Link from 'next/link';
import { Icon } from '@/shared/components/Icon';
import { EMAIL_MESSAGES } from '@/config/emailMessages';
import { useAuth } from '@/features/auth/context/AuthContext';
import { mapSupabaseAuthError } from '@/features/auth/utils/mapSupabaseAuthError';
import { FULL_PAGE_SHELL_CLASS } from '@/shared/constants/pageShell';

export const ForgotPasswordPage = () => {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setIsSubmitting(true);
    try {
      await resetPassword(email.trim());
      setSuccess(true);
    } catch (err) {
      setError(mapSupabaseAuthError(err, 'No se pudo enviar el correo. Intenta de nuevo.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={cn('flex items-center justify-center overflow-hidden px-6', FULL_PAGE_SHELL_CLASS)}>
      {/* Background glow effects */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="bg-ambient-a/30 absolute top-1/3 left-1/4 h-96 w-96 animate-pulse rounded-full blur-3xl"></div>
        <div className="bg-ambient-b/30 absolute right-1/4 bottom-1/3 h-96 w-96 animate-pulse rounded-full blur-3xl"></div>
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
              'from-cta-text-start via-cta-text-via to-cta-text-end mb-4 bg-linear-to-r bg-clip-text text-3xl',
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
                  'focus:border-app-ring focus:ring-app-ring/30 focus:ring-2 focus:outline-none'
                )}
                required
              />
            </div>
          </div>

          {success ? (
            <div className="flex items-start gap-3 rounded-lg border border-green-500/50 bg-green-500/20 p-4">
              <Icon name="check-circle" className="mt-0.5 shrink-0 text-green-400" />
              <p className="text-sm text-green-300">
                Si existe una cuenta con ese correo, recibirás un enlace para restablecer tu contraseña.
              </p>
            </div>
          ) : null}

          {error ? (
            <div className="flex items-start gap-3 rounded-lg border border-red-500/50 bg-red-500/20 p-4">
              <Icon name="exclamation-circle" className="mt-0.5 shrink-0 text-red-400" />
              <p className="text-sm text-red-400">{error}</p>
            </div>
          ) : null}

          <button
            type="submit"
            disabled={isSubmitting || success}
            className={cn(
              'from-cta-from to-cta-to w-full cursor-pointer rounded-lg bg-linear-to-r px-4 py-3',
              'hover:shadow-app-ring/50 font-bold text-white transition-all duration-300 hover:shadow-lg',
              'disabled:cursor-not-allowed disabled:opacity-60'
            )}
          >
            {isSubmitting ? (
              <span className="inline-flex items-center justify-center gap-2">
                <Icon name="spinner" className="animate-spin" />
                Enviando...
              </span>
            ) : (
              EMAIL_MESSAGES.forgotPasswordPage.buttonText
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
