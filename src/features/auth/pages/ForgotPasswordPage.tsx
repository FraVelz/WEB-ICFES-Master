'use client';
import { cn } from '@/utils/cn';
import { useState } from 'react';
import Link from 'next/link';
import { Icon } from '@/shared/components/Icon';
import { useAuth } from '@/context/AuthContext';
import { EMAIL_MESSAGES } from '@/config/emailMessages';
import { mapSupabaseAuthError } from '@/utils/mapSupabaseAuthError';

export const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [step, setStep] = useState(1); // 1: pedir email, 2: confirmación enviada
  const { resetPassword, verifyEmailExists } = useAuth();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setIsLoading(true);

    try {
      // Modo visual: simula envío (backend pendiente)
      await resetPassword(email);
      setSuccess(true);
      setStep(2);
      setEmail('');
    } catch (err) {
      setError(mapSupabaseAuthError(err, EMAIL_MESSAGES.forgotPasswordPage.errorSendingEmail));
    } finally {
      setIsLoading(false);
    }
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

        {/* Step 1: Email Verification */}
        {step === 1 && (
          <>
            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email */}
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

              {/* Error Message */}
              {error && (
                <div className="flex items-start gap-3 rounded-lg border border-red-500/50 bg-red-500/20 p-4">
                  <Icon name="exclamation-circle" className="mt-0.5 shrink-0 text-red-400" />
                  <p className="text-sm text-red-400">{error}</p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className={cn(
                  'w-full cursor-pointer rounded-lg bg-linear-to-r from-cyan-500 to-blue-600 px-4 py-3',
                  'font-bold text-white transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/50',
                  'disabled:cursor-not-allowed disabled:opacity-50'
                )}
              >
                {isLoading
                  ? EMAIL_MESSAGES.forgotPasswordPage.buttonLoadingText
                  : EMAIL_MESSAGES.forgotPasswordPage.buttonText}
              </button>
            </form>
          </>
        )}

        {/* Step 2: Success Message */}
        {step === 2 && success && (
          <div className="space-y-6">
            <div className="mb-6 flex justify-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full border border-green-500/50 bg-green-500/20">
                <Icon name="check-circle" size="2xl" className="text-4xl text-green-400" />
              </div>
            </div>

            <div>
              <h2 className="mb-3 text-center text-2xl font-bold text-white">
                {EMAIL_MESSAGES.forgotPasswordPage.successTitle}
              </h2>
              <p className="text-center text-slate-400">{EMAIL_MESSAGES.forgotPasswordPage.successMessage}</p>
            </div>

            <div className="space-y-2 rounded-lg border border-slate-700 bg-slate-800/50 p-4">
              <p className="text-sm text-slate-300">
                <strong>{EMAIL_MESSAGES.forgotPasswordPage.importantLabel}</strong>
              </p>
              <ul className="list-inside list-disc space-y-1 text-sm text-slate-400">
                {EMAIL_MESSAGES.forgotPasswordPage.importanceList.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => {
                  setStep(1);
                  setSuccess(false);
                  setError('');
                }}
                className="w-full cursor-pointer px-4 py-3 font-bold text-cyan-400 transition-colors hover:text-cyan-300"
              >
                {EMAIL_MESSAGES.forgotPasswordPage.useAnotherEmailButton}
              </button>
              <Link
                href="/login"
                className="block w-full rounded-lg bg-slate-800 px-4 py-3 text-center font-bold text-white transition-all hover:bg-slate-700"
              >
                {EMAIL_MESSAGES.forgotPasswordPage.backToLogin}
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
