'use client';

import { cn } from '@/utils/cn';
import { Icon } from '@/shared/components/Icon';
import { EMAIL_MESSAGES } from '@/config/emailMessages';
import { FULL_PAGE_SHELL_CLASS } from '@/shared/constants/pageShell';
import { ResetPasswordForm } from './reset-password/ResetPasswordForm';
import { ResetPasswordSuccess } from './reset-password/ResetPasswordSuccess';
import { useResetPassword } from './reset-password/useResetPassword';

function ResetPasswordGlow() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div className="bg-ambient-a/30 absolute top-1/3 left-1/4 h-96 w-96 animate-pulse rounded-full blur-3xl" />
      <div className="bg-ambient-b/30 absolute right-1/4 bottom-1/3 h-96 w-96 animate-pulse rounded-full blur-3xl" />
    </div>
  );
}

export const ResetPasswordPage = () => {
  const {
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    isLoading,
    error,
    success,
    showPassword,
    setShowPassword,
    showConfirmPassword,
    setShowConfirmPassword,
    verifying,
    hasRecoverySession,
    handleSubmit,
  } = useResetPassword();

  if (verifying) {
    return (
      <div className={cn('flex items-center justify-center overflow-hidden px-6', FULL_PAGE_SHELL_CLASS)}>
        <ResetPasswordGlow />
        <div className="relative z-10 text-center">
          <p className="text-on-surface text-xl">Verificando tu enlace de recuperación...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('flex items-center justify-center overflow-hidden px-6', FULL_PAGE_SHELL_CLASS)}>
      <ResetPasswordGlow />

      <div className="relative z-10 w-full max-w-md">
        {success ? (
          <ResetPasswordSuccess />
        ) : (
          <>
            <div className="mb-8 text-center">
              <div className="mb-4 flex justify-center">
                <div
                  className={cn(
                    'border-app-ring/50 bg-app-ring/20 flex h-16 w-16 items-center justify-center',
                    'rounded-full border'
                  )}
                >
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
              <p className="text-on-surface-muted">{EMAIL_MESSAGES.resetPasswordPage.subtitle}</p>
            </div>

            {error ? (
              <div className="mb-6 flex items-start gap-3 rounded-lg border border-red-500/50 bg-red-500/20 p-4">
                <Icon name="exclamation-circle" className="mt-0.5 shrink-0 text-red-400" />
                <p className="text-sm text-red-400">{error}</p>
              </div>
            ) : null}

            {hasRecoverySession ? (
              <ResetPasswordForm
                password={password}
                confirmPassword={confirmPassword}
                showPassword={showPassword}
                showConfirmPassword={showConfirmPassword}
                isLoading={isLoading}
                onPasswordChange={setPassword}
                onConfirmPasswordChange={setConfirmPassword}
                onTogglePassword={() => setShowPassword(!showPassword)}
                onToggleConfirmPassword={() => setShowConfirmPassword(!showConfirmPassword)}
                onSubmit={handleSubmit}
              />
            ) : null}
          </>
        )}
      </div>
    </div>
  );
};
