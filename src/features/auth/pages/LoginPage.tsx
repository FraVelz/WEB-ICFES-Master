'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Icon } from '@/shared/components/Icon';
import { useAuth } from '@/context/AuthContext';
import { GoogleSignInButton } from '@/shared/components/atoms/GoogleSignInButton';
import { mapSupabaseAuthError } from '@/utils/mapSupabaseAuthError';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get('from');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(email, password);

      if (from === 'pricing') {
        localStorage.setItem('fromPricing', 'true');
        router.replace('/');
      } else {
        router.push('/ruta-aprendizaje');
      }
    } catch (err) {
      setError(mapSupabaseAuthError(err, 'Error al iniciar sesión'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-dvh flex-col overflow-hidden bg-linear-to-b from-black via-slate-950 to-black px-6 text-white">
      {/* Background glow effects */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute top-1/3 left-1/4 h-96 w-96 animate-pulse rounded-full bg-blue-500/30 blur-3xl"></div>
        <div className="absolute right-1/4 bottom-1/3 h-96 w-96 animate-pulse rounded-full bg-purple-500/30 blur-3xl"></div>
      </div>

      {/* Header Mobile - Solo visible en móvil */}
      <div className="relative z-10">
        <div className="flex items-center justify-between py-4">
          <Link href="/" className="text-slate-400 transition-colors hover:text-slate-300">
            <Icon name="times" size="2xl" className="text-2xl" />
          </Link>
          <h2 className="text-lg font-semibold">Ingresa tus datos</h2>
          <div className="w-6"></div>
        </div>
        <div className="h-px bg-linear-to-r from-transparent via-slate-700 to-transparent"></div>
      </div>

      {/* Login Card */}
      <div className="relative z-10 flex w-full flex-1 items-center justify-center">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-linear-to-r from-cyan-500 to-blue-600">
              <Icon name="rocket" size="2xl" className="text-2xl" />
            </div>
            <h1 className="mb-2 bg-linear-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-3xl font-black text-transparent md:text-4xl">
              ICFES Master
            </h1>
            <p className="text-slate-400">Prepárate para dominar el ICFES</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-semibold">
                Email
              </label>
              <div className="relative">
                <Icon name="envelope" className="absolute top-1/2 left-4 -translate-y-1/2 text-slate-400" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  className="w-full rounded-lg border border-slate-700 bg-slate-800/50 py-3 pr-4 pl-10 transition-all focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30 focus:outline-none"
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
                <Icon name="lock" className="absolute top-1/2 left-4 -translate-y-1/2 text-slate-400" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-lg border border-slate-700 bg-slate-800/50 py-3 pr-12 pl-10 transition-all focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30 focus:outline-none"
                  required
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
              className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-linear-to-r from-cyan-500 to-blue-600 px-4 py-3 font-bold text-white transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"></div>
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

          {/* Google Sign-In */}
          <GoogleSignInButton redirectAfterLogin={from === 'pricing' ? '/' : '/ruta-aprendizaje'} />

          {/* Links */}
          <div className="mt-6 space-y-4">
            {/* Forgot Password Link */}
            <p className="text-center">
              <Link href="/forgot-password" className="text-sm text-slate-400 transition-colors hover:text-slate-300">
                ¿Olvidaste tu contraseña?
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Legal Links Footer - Pegado al final */}
      <div className="relative z-10 mt-auto w-full border-t border-slate-700/50 py-4">
        <div className="mx-auto max-w-md">
          <p className="mb-3 text-center text-xs text-slate-500">
            Al registrarte, aceptas nuestros términos de servicio
          </p>
          <div className="flex items-center justify-center gap-4 text-xs">
            <a href="/privacidad" className="text-slate-400 transition-colors hover:text-slate-300">
              Política de Privacidad
            </a>
            <span className="text-slate-600">|</span>
            <a href="/terminos" className="text-slate-400 transition-colors hover:text-slate-300">
              Términos y Condiciones
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
