'use client';
import { cn } from '@/utils/cn';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Icon } from '@/shared/components/Icon';
import { useAuth } from '@/context/AuthContext';
import { GoogleSignInButton } from '@/shared/components/atoms/GoogleSignInButton';
import { mapSupabaseAuthError, REQUIRES_EMAIL_CONFIRMATION } from '@/utils/mapSupabaseAuthError';

export const SignupPage = () => {
  const [formData, setFormData] = useState({
    displayName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [onboardingAnswers, setOnboardingAnswers] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [pendingEmailConfirmation, setPendingEmailConfirmation] = useState(false);
  const [validations, setValidations] = useState({
    minLength: false,
    hasNumber: false,
    hasUppercase: false,
  });
  const { signup } = useAuth();
  const router = useRouter();

  // Prefill from onboarding session when present
  useEffect(() => {
    const answers = sessionStorage.getItem('onboardingAnswers');
    if (answers) {
      setOnboardingAnswers(JSON.parse(answers));
    }
  }, []);

  // Live password rule checks
  const validatePassword = (pass: string) => {
    setValidations({
      minLength: pass.length >= 6,
      hasNumber: /[0-9]/.test(pass),
      hasUppercase: /[A-Z]/.test(pass),
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === 'password') {
      validatePassword(value);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    // Validaciones
    if (!formData.displayName.trim()) {
      setError('Por favor ingresa tu nombre');
      return;
    }

    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    setIsLoading(true);

    try {
      await signup(formData.email, formData.password, formData.displayName);
      router.push('/perfil');
    } catch (err) {
      if (err instanceof Error && err.message === REQUIRES_EMAIL_CONFIRMATION) {
        setPendingEmailConfirmation(true);
        return;
      }
      setError(mapSupabaseAuthError(err, 'Error en el registro'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={cn(
        'flex min-h-dvh items-center justify-center overflow-hidden bg-linear-to-b from-black',
        'via-slate-950 to-black px-6 py-12 text-white'
      )}
    >
      {/* Background glow effects */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute top-1/3 left-1/4 h-96 w-96 animate-pulse rounded-full bg-blue-500/30 blur-3xl"></div>
        <div className="absolute right-1/4 bottom-1/3 h-96 w-96 animate-pulse rounded-full bg-purple-500/30 blur-3xl"></div>
      </div>

      {/* Signup Card */}
      <div className="relative z-10 w-full max-w-md">
        {/* Header with back button if from onboarding */}
        {onboardingAnswers && (
          <button
            onClick={() => router.push('/onboarding')}
            className="mb-6 inline-flex cursor-pointer items-center gap-2 text-sm text-cyan-400 transition-colors hover:text-cyan-300"
          >
            <Icon name="arrow-left" />
            Hacer de nuevo el Cuestionario
          </button>
        )}

        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-linear-to-r from-cyan-500 to-blue-600">
            <Icon name="rocket" size="2xl" className="text-2xl" />
          </div>
          <h1
            className={cn(
              'mb-2 bg-linear-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-3xl',
              'font-black text-transparent md:text-4xl'
            )}
          >
            Únete a ICFES Master
          </h1>
          <p className="text-slate-400">
            {onboardingAnswers ? 'Completa tu registro con tus datos' : 'Crea tu cuenta y comienza a prepararte'}
          </p>
        </div>

        {pendingEmailConfirmation ? (
          <div className="space-y-6 rounded-xl border border-cyan-500/30 bg-cyan-950/20 p-6 text-center">
            <Icon name="envelope" className="mx-auto text-4xl text-cyan-400" />
            <p className="text-lg text-slate-200">
              Revisa tu correo y abre el enlace para confirmar tu cuenta. Luego podrás iniciar sesión.
            </p>
            <Link
              href="/login"
              className={cn(
                'inline-flex items-center justify-center rounded-lg bg-cyan-600 px-6 py-3 font-semibold',
                'text-white transition hover:bg-cyan-500'
              )}
            >
              Ir a iniciar sesión
            </Link>
          </div>
        ) : null}

        {!pendingEmailConfirmation ? (
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Display Name */}
            <div>
              <label htmlFor="displayName" className="mb-2 block text-sm font-semibold">
                Nombre Completo
              </label>
              <div className="relative">
                <Icon name="user" className="absolute top-1/2 left-4 -translate-y-1/2 text-slate-400" />
                <input
                  id="displayName"
                  type="text"
                  name="displayName"
                  value={formData.displayName}
                  onChange={handleChange}
                  placeholder="Juan Pérez"
                  className={cn(
                    'w-full rounded-lg border border-slate-700 bg-slate-800/50 py-3 pr-4 pl-10 transition-all',
                    'focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30 focus:outline-none'
                  )}
                  required
                />
              </div>
            </div>

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
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="tu@email.com"
                  className={cn(
                    'w-full rounded-lg border border-slate-700 bg-slate-800/50 py-3 pr-4 pl-10 transition-all',
                    'focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30 focus:outline-none'
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
                <Icon name="lock" className="absolute top-1/2 left-4 -translate-y-1/2 text-slate-400" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className={cn(
                    'w-full rounded-lg border border-slate-700 bg-slate-800/50 py-3 pr-12 pl-10 transition-all',
                    'focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30 focus:outline-none'
                  )}
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

              {/* Password Validations */}
              <div className="mt-3 space-y-2 text-xs">
                <div
                  className={cn('flex items-center gap-2', validations.minLength ? 'text-green-400' : 'text-slate-500')}
                >
                  <Icon name="check-circle" className={validations.minLength ? 'opacity-100' : 'opacity-50'} />
                  Al menos 6 caracteres
                </div>
                <div
                  className={cn('flex items-center gap-2', validations.hasNumber ? 'text-green-400' : 'text-slate-500')}
                >
                  <Icon name="check-circle" className={validations.hasNumber ? 'opacity-100' : 'opacity-50'} />
                  Contiene un número
                </div>
                <div
                  className={cn(
                    'flex items-center gap-2',
                    validations.hasUppercase ? 'text-green-400' : 'text-slate-500'
                  )}
                >
                  <Icon name="check-circle" className={validations.hasUppercase ? 'opacity-100' : 'opacity-50'} />
                  Contiene una mayúscula
                </div>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="mb-2 block text-sm font-semibold">
                Confirmar Contraseña
              </label>
              <div className="relative">
                <Icon name="lock" className="absolute top-1/2 left-4 -translate-y-1/2 text-slate-400" />
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className={cn(
                    'w-full rounded-lg border border-slate-700 bg-slate-800/50 py-3 pr-12 pl-10 transition-all',
                    'focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30 focus:outline-none'
                  )}
                  required
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
                'flex w-full items-center justify-center gap-2 rounded-lg bg-linear-to-r from-cyan-500',
                'to-blue-600 px-4 py-3 font-bold text-white transition-all duration-300 hover:shadow-lg',
                'hover:shadow-cyan-500/50 disabled:cursor-not-allowed disabled:opacity-50'
              )}
            >
              {isLoading ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"></div>
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
        ) : null}

        {!pendingEmailConfirmation ? (
          <div className="mt-6">
            <GoogleSignInButton redirectAfterLogin="/perfil" />
          </div>
        ) : null}
      </div>
    </div>
  );
};
