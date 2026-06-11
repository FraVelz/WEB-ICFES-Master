'use client';

import { cn } from '@/utils/cn';
import Link from 'next/link';
import { Icon } from '@/shared/components/Icon';
import { GoogleSignInButton } from '@/features/auth/components/GoogleSignInButton';

type LoginFormProps = {
  email: string;
  password: string;
  showPassword: boolean;
  error: string;
  isSubmitting: boolean;
  authLoading: boolean;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onTogglePassword: () => void;
  onSubmit: (e: React.FormEvent) => void;
};

export function LoginForm({
  email,
  password,
  showPassword,
  error,
  isSubmitting,
  authLoading,
  onEmailChange,
  onPasswordChange,
  onTogglePassword,
  onSubmit,
}: LoginFormProps) {
  return (
    <>
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
          ICFES Master
        </h1>
        <p className="text-on-surface-muted">Prepárate para dominar el ICFES</p>
      </div>

      <form onSubmit={onSubmit} className="space-y-6">
        <div>
          <label htmlFor="email" className="mb-2 block text-sm font-semibold">
            Email
          </label>
          <div className="relative">
            <Icon name="envelope" className="text-on-surface-muted absolute top-1/2 left-4 -translate-y-1/2" />
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => onEmailChange(e.target.value)}
              placeholder="tu@email.com"
              className={cn(
                'border-surface-border bg-surface-elevated/50 text-on-surface w-full rounded-lg border py-3 pr-4 pl-10',
                'focus:border-app-ring focus:ring-app-ring/30 transition-all focus:ring-2 focus:outline-none'
              )}
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="password" className="mb-2 block text-sm font-semibold">
            Contraseña
          </label>
          <div className="relative">
            <Icon name="lock" className="text-on-surface-muted absolute top-1/2 left-4 -translate-y-1/2" />
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => onPasswordChange(e.target.value)}
              placeholder="••••••••"
              className={cn(
                'border-surface-border bg-surface-elevated/50 text-on-surface w-full rounded-lg',
                'border py-3 pr-12 pl-10',
                'focus:border-app-ring focus:ring-app-ring/30 transition-all focus:ring-2 focus:outline-none'
              )}
              required
            />
            <button
              type="button"
              onClick={onTogglePassword}
              aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              className="text-on-surface-muted hover:text-on-surface absolute top-1/2 right-4 -translate-y-1/2"
            >
              <Icon name={showPassword ? 'eye-slash' : 'eye'} aria-hidden />
            </button>
          </div>
        </div>

        {error ? (
          <div role="alert" className="flex items-start gap-3 rounded-lg border border-red-500/50 bg-red-500/20 p-4">
            <Icon name="exclamation-circle" className="mt-0.5 shrink-0 text-red-400" aria-hidden />
            <p className="text-sm text-red-400">{error}</p>
          </div>
        ) : null}

        <button
          type="submit"
          disabled={isSubmitting || authLoading}
          className={cn(
            'flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-linear-to-r',
            'from-cta-from to-cta-to px-4 py-3 font-bold text-white transition-all duration-300',
            'hover:shadow-app-ring/50 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60'
          )}
        >
          {isSubmitting ? (
            <>
              <Icon name="spinner" className="animate-spin" />
              Iniciando sesión...
            </>
          ) : (
            <>
              <Icon name="rocket" />
              Iniciar Sesión
            </>
          )}
        </button>
      </form>

      <GoogleSignInButton />

      <div className="mt-6 space-y-4">
        <p className="text-on-surface-muted text-center text-sm">
          ¿No tienes cuenta?{' '}
          <Link href="/signup" className="text-app-accent hover:text-app-accent-muted font-semibold transition-colors">
            Crear cuenta
          </Link>
        </p>
        <p className="text-center">
          <Link
            href="/forgot-password"
            className="text-on-surface-muted hover:text-on-surface text-sm transition-colors"
          >
            ¿Olvidaste tu contraseña?
          </Link>
        </p>
      </div>
    </>
  );
}
