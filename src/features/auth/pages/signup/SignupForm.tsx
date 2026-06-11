'use client';

import { cn } from '@/utils/cn';
import { Icon } from '@/shared/components/Icon';
import type { PasswordValidations, SignupFormData } from './useSignupForm';
import { SIGNUP_INPUT_CLASS } from './signupFormStyles';

type SignupFormProps = {
  formData: SignupFormData;
  validations: PasswordValidations;
  showPassword: boolean;
  showConfirmPassword: boolean;
  error: string;
  successMessage: string;
  isSubmitting: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onTogglePassword: () => void;
  onToggleConfirmPassword: () => void;
};

function PasswordRule({ met, label }: { met: boolean; label: string }) {
  return (
    <div className={cn('flex items-center gap-2', met ? 'text-green-400' : 'text-on-surface-muted')}>
      <Icon name="check-circle" className={met ? 'opacity-100' : 'opacity-50'} />
      {label}
    </div>
  );
}

export function SignupForm({
  formData,
  validations,
  showPassword,
  showConfirmPassword,
  error,
  successMessage,
  isSubmitting,
  onChange,
  onSubmit,
  onTogglePassword,
  onToggleConfirmPassword,
}: SignupFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div>
        <label htmlFor="displayName" className="mb-2 block text-sm font-semibold">
          Nombre Completo
        </label>
        <div className="relative">
          <Icon name="user" className="absolute top-1/2 left-4 -translate-y-1/2 text-on-surface-muted" />
          <input
            id="displayName"
            type="text"
            name="displayName"
            value={formData.displayName}
            onChange={onChange}
            placeholder="Juan Pérez"
            className={cn(SIGNUP_INPUT_CLASS, 'py-3 pr-4 pl-10')}
            required
          />
        </div>
      </div>

      <div>
        <label htmlFor="email" className="mb-2 block text-sm font-semibold">
          Email
        </label>
        <div className="relative">
          <Icon name="envelope" className="absolute top-1/2 left-4 -translate-y-1/2 text-on-surface-muted" />
          <input
            id="email"
            type="email"
            name="email"
            value={formData.email}
            onChange={onChange}
            placeholder="tu@email.com"
            className={cn(SIGNUP_INPUT_CLASS, 'py-3 pr-4 pl-10')}
            required
          />
        </div>
      </div>

      <div>
        <label htmlFor="password" className="mb-2 block text-sm font-semibold">
          Contraseña
        </label>
        <div className="relative">
          <Icon name="lock" className="absolute top-1/2 left-4 -translate-y-1/2 text-on-surface-muted" />
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            name="password"
            value={formData.password}
            onChange={onChange}
            placeholder="••••••••"
            className={cn(SIGNUP_INPUT_CLASS, 'py-3 pr-12 pl-10')}
            aria-describedby="password-rules"
            required
          />
          <button
            type="button"
            onClick={onTogglePassword}
            aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            className="absolute top-1/2 right-4 -translate-y-1/2 text-on-surface-muted hover:text-on-surface-muted"
          >
            <Icon name={showPassword ? 'eye-slash' : 'eye'} aria-hidden />
          </button>
        </div>
        <div id="password-rules" className="mt-3 space-y-2 text-xs" aria-live="polite">
          <PasswordRule met={validations.minLength} label="Al menos 6 caracteres" />
          <PasswordRule met={validations.hasNumber} label="Contiene un número" />
          <PasswordRule met={validations.hasUppercase} label="Contiene una mayúscula" />
        </div>
      </div>

      <div>
        <label htmlFor="confirmPassword" className="mb-2 block text-sm font-semibold">
          Confirmar Contraseña
        </label>
        <div className="relative">
          <Icon name="lock" className="absolute top-1/2 left-4 -translate-y-1/2 text-on-surface-muted" />
          <input
            id="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={onChange}
            placeholder="••••••••"
            className={cn(SIGNUP_INPUT_CLASS, 'py-3 pr-12 pl-10')}
            required
          />
          <button
            type="button"
            onClick={onToggleConfirmPassword}
            aria-label={showConfirmPassword ? 'Ocultar confirmación de contraseña' : 'Mostrar confirmación de contraseña'}
            className="absolute top-1/2 right-4 -translate-y-1/2 text-on-surface-muted hover:text-on-surface-muted"
          >
            <Icon name={showConfirmPassword ? 'eye-slash' : 'eye'} aria-hidden />
          </button>
        </div>
      </div>

      {successMessage ? (
        <div role="status" className="flex items-start gap-3 rounded-lg border border-green-500/50 bg-green-500/20 p-4">
          <Icon name="check-circle" className="mt-0.5 shrink-0 text-green-400" aria-hidden />
          <p className="text-sm text-green-300">{successMessage}</p>
        </div>
      ) : null}

      {error ? (
        <div role="alert" className="flex items-start gap-3 rounded-lg border border-red-500/50 bg-red-500/20 p-4">
          <Icon name="exclamation-circle" className="mt-0.5 shrink-0 text-red-400" aria-hidden />
          <p className="text-sm text-red-400">{error}</p>
        </div>
      ) : null}

      <button
        type="submit"
        disabled={isSubmitting || Boolean(successMessage)}
        className={cn(
          'from-cta-from flex w-full items-center justify-center gap-2 rounded-lg bg-linear-to-r',
          'to-cta-to px-4 py-3 font-bold text-white transition-all duration-300 hover:shadow-lg',
          'hover:shadow-app-ring/50 disabled:cursor-not-allowed disabled:opacity-60'
        )}
      >
        {isSubmitting ? (
          <>
            <Icon name="spinner" className="animate-spin" />
            Creando cuenta...
          </>
        ) : (
          <>
            <Icon name="rocket" />
            Crear Cuenta
          </>
        )}
      </button>
    </form>
  );
}
