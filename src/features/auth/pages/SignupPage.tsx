'use client';

import { cn } from '@/utils/cn';
import { GoogleSignInButton } from '@/features/auth/components/GoogleSignInButton';
import { FULL_PAGE_SHELL_CLASS } from '@/shared/constants/pageShell';
import { SignupForm } from './signup/SignupForm';
import { SignupPageHeader } from './signup/SignupPageHeader';
import { useSignupForm } from './signup/useSignupForm';

export const SignupPage = () => {
  const {
    formData,
    onboardingAnswers,
    showPassword,
    setShowPassword,
    showConfirmPassword,
    setShowConfirmPassword,
    error,
    successMessage,
    isSubmitting,
    validations,
    handleChange,
    handleSubmit,
  } = useSignupForm();

  return (
    <div className={cn('flex min-h-full items-center justify-center px-6 py-12', FULL_PAGE_SHELL_CLASS)}>
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="bg-ambient-a/30 absolute top-1/3 left-1/4 h-96 w-96 animate-pulse rounded-full blur-3xl" />
        <div className="bg-ambient-b/30 absolute right-1/4 bottom-1/3 h-96 w-96 animate-pulse rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <SignupPageHeader hasOnboardingAnswers={Boolean(onboardingAnswers)} />

        <SignupForm
          formData={formData}
          validations={validations}
          showPassword={showPassword}
          showConfirmPassword={showConfirmPassword}
          error={error}
          successMessage={successMessage}
          isSubmitting={isSubmitting}
          onChange={handleChange}
          onSubmit={handleSubmit}
          onTogglePassword={() => setShowPassword(!showPassword)}
          onToggleConfirmPassword={() => setShowConfirmPassword(!showConfirmPassword)}
        />

        <div className="mt-6">
          <GoogleSignInButton />
        </div>
      </div>
    </div>
  );
};
