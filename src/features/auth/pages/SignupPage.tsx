'use client';
import { cn } from '@/utils/cn';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Icon } from '@/shared/components/Icon';
import { GoogleSignInButton } from '@/features/auth/components/GoogleSignInButton';
import { useAuth } from '@/features/auth/context/AuthContext';
import { buildLevelAssessmentUrl } from '@/features/auth/constants/skillLevelRoutes';
import { mapSupabaseAuthError, REQUIRES_EMAIL_CONFIRMATION } from '@/features/auth/utils/mapSupabaseAuthError';
import { FULL_PAGE_SHELL_CLASS } from '@/shared/constants/pageShell';

export const SignupPage = () => {
  const { signup } = useAuth();
  const [formData, setFormData] = useState({
    displayName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [onboardingAnswers, setOnboardingAnswers] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validations, setValidations] = useState({
    minLength: false,
    hasNumber: false,
    hasUppercase: false,
  });
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
    setSuccessMessage('');

    if (!formData.displayName.trim()) {
      setError('Por favor ingresa tu nombre');
      return;
    }

    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    if (!/[0-9]/.test(formData.password)) {
      setError('La contraseña debe incluir al menos un número');
      return;
    }

    if (!/[A-Z]/.test(formData.password)) {
      setError('La contraseña debe incluir al menos una mayúscula');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    setIsSubmitting(true);
    try {
      await signup(formData.email.trim(), formData.password, formData.displayName.trim());
      sessionStorage.removeItem('onboardingAnswers');
      router.push(buildLevelAssessmentUrl('account'));
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      if (message === REQUIRES_EMAIL_CONFIRMATION) {
        setSuccessMessage('Te enviamos un correo de confirmación. Ábrelo y luego inicia sesión con tu cuenta.');
        return;
      }
      setError(mapSupabaseAuthError(err, 'No se pudo crear la cuenta. Intenta de nuevo.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={cn('flex items-center justify-center overflow-hidden px-6 py-12', FULL_PAGE_SHELL_CLASS)}>
      {/* Background glow effects */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="bg-ambient-a/30 absolute top-1/3 left-1/4 h-96 w-96 animate-pulse rounded-full blur-3xl"></div>
        <div className="bg-ambient-b/30 absolute right-1/4 bottom-1/3 h-96 w-96 animate-pulse rounded-full blur-3xl"></div>
      </div>

      {/* Signup Card */}
      <div className="relative z-10 w-full max-w-md">
        <Link
          href="/login"
          className="mb-6 inline-flex items-center gap-2 text-slate-400 transition-colors hover:text-slate-300"
        >
          <Icon name="arrow-left" />
          Volver al login
        </Link>

        {/* Back to onboarding when coming from that flow */}
        {onboardingAnswers && (
          <button
            onClick={() => router.push('/onboarding')}
            className="text-app-accent hover:text-app-accent-muted mb-6 inline-flex cursor-pointer items-center gap-2 text-sm transition-colors"
          >
            <Icon name="arrow-left" />
            Hacer de nuevo el Cuestionario
          </button>
        )}

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
            Únete a ICFES Master
          </h1>
          <p className="text-slate-400">
            {onboardingAnswers ? 'Completa tu registro con tus datos' : 'Crea tu cuenta y comienza a prepararte'}
          </p>
        </div>

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
                  'focus:border-app-ring focus:ring-app-ring/30 focus:ring-2 focus:outline-none'
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
                  'focus:border-app-ring focus:ring-app-ring/30 focus:ring-2 focus:outline-none'
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
                  'focus:border-app-ring focus:ring-app-ring/30 focus:ring-2 focus:outline-none'
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

          {successMessage ? (
            <div className="flex items-start gap-3 rounded-lg border border-green-500/50 bg-green-500/20 p-4">
              <Icon name="check-circle" className="mt-0.5 shrink-0 text-green-400" />
              <p className="text-sm text-green-300">{successMessage}</p>
            </div>
          ) : null}

          {error ? (
            <div className="flex items-start gap-3 rounded-lg border border-red-500/50 bg-red-500/20 p-4">
              <Icon name="exclamation-circle" className="mt-0.5 shrink-0 text-red-400" />
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

        <div className="mt-6">
          <GoogleSignInButton />
        </div>
      </div>
    </div>
  );
};
