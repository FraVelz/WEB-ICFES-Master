'use client';

import { cn } from '@/utils/cn';
import { Icon } from '@/shared/components/Icon';
import { EMAIL_MESSAGES } from '@/config/emailMessages';

type ResetPasswordFormProps = {
  password: string;
  confirmPassword: string;
  showPassword: boolean;
  showConfirmPassword: boolean;
  isLoading: boolean;
  onPasswordChange: (value: string) => void;
  onConfirmPasswordChange: (value: string) => void;
  onTogglePassword: () => void;
  onToggleConfirmPassword: () => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
};

const INPUT_CLASS = cn(
  'w-full rounded-lg border border-slate-700 bg-slate-800/50 py-3 pr-10 pl-10 transition-all',
  'focus:border-app-ring focus:ring-app-ring/30 focus:ring-2 focus:outline-none'
);

function RequirementItem({ met, label }: { met: boolean; label: string }) {
  return (
    <li className={cn('flex items-center gap-1.5', met ? 'text-green-400' : '')}>
      <Icon name="check" size="sm" className="shrink-0" />
      {label}
    </li>
  );
}

export function ResetPasswordForm({
  password,
  confirmPassword,
  showPassword,
  showConfirmPassword,
  isLoading,
  onPasswordChange,
  onConfirmPasswordChange,
  onTogglePassword,
  onToggleConfirmPassword,
  onSubmit,
}: ResetPasswordFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
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
            onChange={(e) => onPasswordChange(e.target.value)}
            placeholder={EMAIL_MESSAGES.resetPasswordPage.passwordPlaceholder}
            className={INPUT_CLASS}
          />
          <button
            type="button"
            onClick={onTogglePassword}
            className="absolute top-1/2 right-4 -translate-y-1/2 text-slate-400 hover:text-slate-300"
          >
            <Icon name={showPassword ? 'eye-slash' : 'eye'} />
          </button>
        </div>
      </div>

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
            onChange={(e) => onConfirmPasswordChange(e.target.value)}
            placeholder={EMAIL_MESSAGES.resetPasswordPage.passwordPlaceholder}
            className={INPUT_CLASS}
          />
          <button
            type="button"
            onClick={onToggleConfirmPassword}
            className="absolute top-1/2 right-4 -translate-y-1/2 text-slate-400 hover:text-slate-300"
          >
            <Icon name={showConfirmPassword ? 'eye-slash' : 'eye'} />
          </button>
        </div>
      </div>

      <div className="rounded-lg border border-slate-700 bg-slate-800/30 p-4">
        <p className="mb-2 text-xs font-semibold text-slate-300">
          {EMAIL_MESSAGES.resetPasswordPage.requirementsTitle}
        </p>
        <ul className="space-y-1 text-xs text-slate-400">
          <RequirementItem met={password.length >= 6} label={EMAIL_MESSAGES.resetPasswordPage.requirement1} />
          <RequirementItem met={/[A-Z]/.test(password)} label={EMAIL_MESSAGES.resetPasswordPage.requirement2} />
          <RequirementItem met={/[0-9]/.test(password)} label={EMAIL_MESSAGES.resetPasswordPage.requirement3} />
          <RequirementItem
            met={password === confirmPassword && Boolean(password)}
            label={EMAIL_MESSAGES.resetPasswordPage.requirement4}
          />
        </ul>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className={cn(
          'from-cta-from to-cta-to w-full rounded-lg bg-linear-to-r px-4 py-3 font-bold text-white',
          'hover:shadow-app-ring/50 transition-all duration-300 hover:shadow-lg',
          'disabled:cursor-not-allowed disabled:opacity-50'
        )}
      >
        {isLoading ? EMAIL_MESSAGES.resetPasswordPage.buttonLoadingText : EMAIL_MESSAGES.resetPasswordPage.buttonText}
      </button>
    </form>
  );
}
