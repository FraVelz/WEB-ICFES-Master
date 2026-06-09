'use client';
import { cn } from '@/utils/cn';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Icon } from '@/shared/components/Icon';
import { EMAIL_MESSAGES } from '@/config/emailMessages';
import { useAuth } from '@/features/auth/context/AuthContext';
import { supabase } from '@/config/supabase';
import { mapSupabaseAuthError } from '@/features/auth/utils/mapSupabaseAuthError';
import { FULL_PAGE_SHELL_CLASS } from '@/shared/constants/pageShell';

export const ResetPasswordPage = () => {
  const router = useRouter();
  const { updatePassword } = useAuth();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [verifying, setVerifying] = useState(true);
  const [hasRecoverySession, setHasRecoverySession] = useState(false);

  // Supabase: recovery session from URL hash
  useEffect(() => {
    const checkSession = async () => {
      if (!supabase) {
        setError('Supabase no configurado');
        setVerifying(false);
        return;
      }
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setHasRecoverySession(!!session);
      setVerifying(false);
      if (!session) {
        setError('Enlace de recuperación inválido o expirado. Solicita uno nuevo.');
      }
    };
    checkSession();
  }, []);

  const validatePassword = (pwd: string): string => {
    if (pwd.length < 6) {
      return EMAIL_MESSAGES.resetPasswordPage.errorPasswordTooShort;
    }
    if (!/[A-Z]/.test(pwd)) {
      return EMAIL_MESSAGES.resetPasswordPage.errorPasswordNoUppercase;
    }
    if (!/[0-9]/.test(pwd)) {
      return EMAIL_MESSAGES.resetPasswordPage.errorPasswordNoNumber;
    }
    return '';
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    // Validaciones
    if (!password || !confirmPassword) {
      setError(EMAIL_MESSAGES.resetPasswordPage.errorEmptyFields);
      return;
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    if (password !== confirmPassword) {
      setError(EMAIL_MESSAGES.resetPasswordPage.errorPasswordsDoNotMatch);
      return;
    }

    setIsLoading(true);

    try {
      await updatePassword(password);
      setSuccess(true);
      setTimeout(() => router.push('/login'), 3000);
    } catch (err) {
      setError(mapSupabaseAuthError(err, EMAIL_MESSAGES.resetPasswordPage.errorGeneric));
    } finally {
      setIsLoading(false);
    }
  };

  if (verifying) {
    return (
      <div className={cn('flex items-center justify-center overflow-hidden px-6', FULL_PAGE_SHELL_CLASS)}>
        <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
          <div className="bg-ambient-a/30 absolute top-1/3 left-1/4 h-96 w-96 animate-pulse rounded-full blur-3xl"></div>
          <div className="bg-ambient-b/30 absolute right-1/4 bottom-1/3 h-96 w-96 animate-pulse rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 text-center">
          <p className="text-on-surface text-xl">Verificando tu enlace de recuperación...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('flex items-center justify-center overflow-hidden px-6', FULL_PAGE_SHELL_CLASS)}>
      {/* Background glow effects */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="bg-ambient-a/30 absolute top-1/3 left-1/4 h-96 w-96 animate-pulse rounded-full blur-3xl"></div>
        <div className="bg-ambient-b/30 absolute right-1/4 bottom-1/3 h-96 w-96 animate-pulse rounded-full blur-3xl"></div>
      </div>

      {/* Card */}
      <div className="relative z-10 w-full max-w-md">
        {/* Success State */}
        {success ? (
          <div className="space-y-6 text-center">
            <div className="mb-6 flex justify-center">
              <div className="bg-lesson-sci-glow-a/20 flex h-20 w-20 animate-pulse items-center justify-center rounded-full border border-green-500/50">
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
        ) : (
          <>
            {/* Header */}
            <div className="mb-8 text-center">
              <div className="mb-4 flex justify-center">
                <div className="border-app-ring/50 bg-app-ring/20 flex h-16 w-16 items-center justify-center rounded-full border">
                  <Icon name="lock" size="2xl" className="text-app-accent text-2xl" />
                </div>
              </div>
              <h1
                className={cn(
                  'from-cta-text-start via-cta-text-via to-cta-text-end mb-4 bg-linear-to-r bg-clip-text text-3xl',
                  'font-black text-transparent md:text-4xl'
                )}
              >
                {EMAIL_MESSAGES.resetPasswordPage.title}
              </h1>
              <p className="text-slate-400">{EMAIL_MESSAGES.resetPasswordPage.subtitle}</p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 flex items-start gap-3 rounded-lg border border-red-500/50 bg-red-500/20 p-4">
                <Icon name="exclamation-circle" className="mt-0.5 shrink-0 text-red-400" />
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}

            {/* Form */}
            {hasRecoverySession && (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Password Field */}
                <div>
                  <label htmlFor="password" className="mb-2 block text-sm font-semibold">
                    {EMAIL_MESSAGES.resetPasswordPage.newPasswordLabel}
                  </label>
                  <div className="relative">
                    <Icon name="lock" className="absolute top-1/2 left-4 -translate-y-1/2 text-slate-400" />
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder={EMAIL_MESSAGES.resetPasswordPage.passwordPlaceholder}
                      className={cn(
                        'w-full rounded-lg border border-slate-700 bg-slate-800/50 py-3 pr-10 pl-10 transition-all',
                        'focus:border-app-ring focus:ring-app-ring/30 focus:ring-2 focus:outline-none'
                      )}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute top-1/2 right-4 -translate-y-1/2 text-slate-400 hover:text-slate-300"
                    >
                      <Icon name={showPassword ? 'eye-slash' : 'eye'} />
                    </button>
                  </div>
                </div>

                {/* Confirm Password Field */}
                <div>
                  <label htmlFor="confirmPassword" className="mb-2 block text-sm font-semibold">
                    {EMAIL_MESSAGES.resetPasswordPage.confirmPasswordLabel}
                  </label>
                  <div className="relative">
                    <Icon name="lock" className="absolute top-1/2 left-4 -translate-y-1/2 text-slate-400" />
                    <input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder={EMAIL_MESSAGES.resetPasswordPage.passwordPlaceholder}
                      className={cn(
                        'w-full rounded-lg border border-slate-700 bg-slate-800/50 py-3 pr-10 pl-10 transition-all',
                        'focus:border-app-ring focus:ring-app-ring/30 focus:ring-2 focus:outline-none'
                      )}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute top-1/2 right-4 -translate-y-1/2 text-slate-400 hover:text-slate-300"
                    >
                      <Icon name={showConfirmPassword ? 'eye-slash' : 'eye'} />
                    </button>
                  </div>
                </div>

                {/* Password Requirements */}
                <div className="rounded-lg border border-slate-700 bg-slate-800/30 p-4">
                  <p className="mb-2 text-xs font-semibold text-slate-300">
                    {EMAIL_MESSAGES.resetPasswordPage.requirementsTitle}
                  </p>
                  <ul className="space-y-1 text-xs text-slate-400">
                    <li className={cn('flex items-center gap-1.5', password.length >= 6 ? 'text-green-400' : '')}>
                      <Icon name="check" size="sm" className="shrink-0" />
                      {EMAIL_MESSAGES.resetPasswordPage.requirement1}
                    </li>
                    <li className={cn('flex items-center gap-1.5', /[A-Z]/.test(password) ? 'text-green-400' : '')}>
                      <Icon name="check" size="sm" className="shrink-0" />
                      {EMAIL_MESSAGES.resetPasswordPage.requirement2}
                    </li>
                    <li className={cn('flex items-center gap-1.5', /[0-9]/.test(password) ? 'text-green-400' : '')}>
                      <Icon name="check" size="sm" className="shrink-0" />
                      {EMAIL_MESSAGES.resetPasswordPage.requirement3}
                    </li>
                    <li
                      className={cn(
                        'flex items-center gap-1.5',
                        password === confirmPassword && password ? 'text-green-400' : ''
                      )}
                    >
                      <Icon name="check" size="sm" className="shrink-0" />
                      {EMAIL_MESSAGES.resetPasswordPage.requirement4}
                    </li>
                  </ul>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className={cn(
                    'from-cta-from to-cta-to w-full rounded-lg bg-linear-to-r px-4 py-3 font-bold text-white',
                    'hover:shadow-app-ring/50 transition-all duration-300 hover:shadow-lg',
                    'disabled:cursor-not-allowed disabled:opacity-50'
                  )}
                >
                  {isLoading
                    ? EMAIL_MESSAGES.resetPasswordPage.buttonLoadingText
                    : EMAIL_MESSAGES.resetPasswordPage.buttonText}
                </button>
              </form>
            )}
          </>
        )}
      </div>
    </div>
  );
};
