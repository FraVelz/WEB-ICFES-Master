'use client';

import { cn } from '@/utils/cn';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Icon } from '@/shared/components/Icon';
import { ThemeToggle } from '@/shared/components/ThemeToggle';
import { GoogleSignInButton } from '@/features/auth/components/GoogleSignInButton';
import { useAuth } from '@/features/auth/context/AuthContext';
import { AUTH_DEFAULT_REDIRECT } from '@/features/auth/constants/authRoutes';
import { mapSupabaseAuthError } from '@/features/auth/utils/mapSupabaseAuthError';

export const LoginPage = () => {
  const router = useRouter();
  const { login, isAuthenticated, loading: authLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.replace(AUTH_DEFAULT_REDIRECT);
    }
  }, [authLoading, isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      await login(email.trim(), password);
      router.push(AUTH_DEFAULT_REDIRECT);
    } catch (err) {
      setError(mapSupabaseAuthError(err, 'No se pudo iniciar sesión. Intenta de nuevo.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="from-surface via-surface-via to-surface text-on-surface flex min-h-dvh flex-col overflow-hidden bg-linear-to-b px-6">
      {/* Background glow effects */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="bg-ambient-a/30 absolute top-1/3 left-1/4 h-96 w-96 animate-pulse rounded-full blur-3xl"></div>
        <div className="bg-ambient-b/30 absolute right-1/4 bottom-1/3 h-96 w-96 animate-pulse rounded-full blur-3xl"></div>
      </div>

      {/* Mobile-only header */}
      <div className="relative z-10">
        <div className="flex items-center justify-between py-4">
          <button
            onClick={() => window.history.back()}
            className="text-on-surface-muted hover:text-on-surface cursor-pointer transition-colors"
          >
            <Icon name="times" size="2xl" className="text-2xl" />
          </button>
          <h2 className="text-lg font-semibold">Ingresa tus datos</h2>
          <ThemeToggle compact />
        </div>
        <div className="via-surface-border h-px bg-linear-to-r from-transparent to-transparent"></div>
      </div>

      {/* Login Card */}
      <div className="relative z-10 flex w-full flex-1 items-center justify-center">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="from-cta-from to-cta-to mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-linear-to-r">
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

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
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
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  className={cn(
                    'border-surface-border bg-surface-elevated/50 text-on-surface w-full rounded-lg border py-3 pr-4 pl-10 transition-all',
                    'focus:border-app-ring focus:ring-app-ring/30 focus:ring-2 focus:outline-none'
                  )}
                  required
                />
              </div>
            </div>

            {/* Password */}
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
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={cn(
                    'border-surface-border bg-surface-elevated/50 text-on-surface w-full rounded-lg border py-3 pr-12 pl-10 transition-all',
                    'focus:border-app-ring focus:ring-app-ring/30 focus:ring-2 focus:outline-none'
                  )}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-on-surface-muted hover:text-on-surface absolute top-1/2 right-4 -translate-y-1/2"
                >
                  <Icon name={showPassword ? 'eye-slash' : 'eye'} />
                </button>
              </div>
            </div>

            {error ? (
              <div className="flex items-start gap-3 rounded-lg border border-red-500/50 bg-red-500/20 p-4">
                <Icon name="exclamation-circle" className="mt-0.5 shrink-0 text-red-400" />
                <p className="text-sm text-red-400">{error}</p>
              </div>
            ) : null}

            {/* Submit Button */}
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

          {/* Links */}
          <div className="mt-6 space-y-4">
            <p className="text-on-surface-muted text-center text-sm">
              ¿No tienes cuenta?{' '}
              <Link
                href="/signup"
                className="text-app-accent hover:text-app-accent-muted font-semibold transition-colors"
              >
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
        </div>
      </div>

      {/* Legal links footer — pinned to bottom */}
      <div className="border-surface-border/50 relative z-10 mt-auto w-full border-t py-4">
        <div className="mx-auto max-w-md">
          <p className="text-on-surface-muted mb-3 text-center text-xs">
            Al registrarte, aceptas nuestros términos de servicio
          </p>
          <div className="flex items-center justify-center gap-4 text-xs">
            <a href="/privacidad" className="text-on-surface-muted hover:text-on-surface transition-colors">
              Política de Privacidad
            </a>
            <span className="text-surface-border">|</span>
            <a href="/terminos" className="text-on-surface-muted hover:text-on-surface transition-colors">
              Términos y Condiciones
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
