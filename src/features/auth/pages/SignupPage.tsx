'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Icon } from '@/shared/components/Icon';
import { useAuth } from '@/context/AuthContext';
import { GoogleSignInButton } from '@/shared/components/atoms/GoogleSignInButton';

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
  const [validations, setValidations] = useState({
    minLength: false,
    hasNumber: false,
    hasUppercase: false,
  });
  const { signup } = useAuth();
  const router = useRouter();

  // Cargar respuestas del onboarding si existen
  useEffect(() => {
    const answers = sessionStorage.getItem('onboardingAnswers');
    if (answers) {
      setOnboardingAnswers(JSON.parse(answers));
    }
  }, []);

  // Validar contraseña en tiempo real
  const validatePassword = (pass) => {
    setValidations({
      minLength: pass.length >= 6,
      hasNumber: /[0-9]/.test(pass),
      hasUppercase: /[A-Z]/.test(pass),
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));

    if (name === 'password') {
      validatePassword(value);
    }
  };

  const handleSubmit = async (e) => {
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
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-dvh bg-linear-to-b from-black via-slate-950 to-black text-white flex items-center justify-center px-6 py-12 overflow-hidden">
      {/* Background glow effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl animate-pulse"></div>
      </div>

      {/* Signup Card */}
      <div className="relative z-10 w-full max-w-md">
        {/* Header with back button if from onboarding */}
        {onboardingAnswers && (
          <button
            onClick={() => router.push('/onboarding')}
            className="cursor-pointer mb-6 inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors text-sm"
          >
            <Icon name="arrow-left" />
            Hacer de nuevo el Cuestionario
          </button>
        )}
        
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-linear-to-r from-cyan-500 to-blue-600 mb-4">
            <Icon name="rocket" size="2xl" className="text-2xl" />
          </div>
          <h1 className="text-3xl md:text-4xl font-black mb-2 bg-linear-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
            Únete a ICFES Master
          </h1>
          <p className="text-slate-400">
            {onboardingAnswers ? 'Completa tu registro con tus datos' : 'Crea tu cuenta y comienza a prepararte'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Display Name */}
          <div>
            <label htmlFor="displayName" className="block text-sm font-semibold mb-2">
              Nombre Completo
            </label>
            <div className="relative">
              <Icon
                name="user"
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                id="displayName"
                type="text"
                name="displayName"
                value={formData.displayName}
                onChange={handleChange}
                placeholder="Juan Pérez"
                className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30 transition-all"
                required
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-semibold mb-2">
              Email
            </label>
            <div className="relative">
              <Icon
                name="envelope"
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="tu@email.com"
                className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30 transition-all"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-semibold mb-2">
              Contraseña
            </label>
            <div className="relative">
              <Icon
                name="lock"
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full pl-10 pr-12 py-3 bg-slate-800/50 border border-slate-700 rounded-lg focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30 transition-all"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300"
              >
                <Icon name={showPassword ? 'eye-slash' : 'eye'} />
              </button>
            </div>

            {/* Password Validations */}
            <div className="mt-3 space-y-2 text-xs">
              <div className={`flex items-center gap-2 ${validations.minLength ? 'text-green-400' : 'text-slate-500'}`}>
                <Icon name="check-circle" className={validations.minLength ? 'opacity-100' : 'opacity-50'} />
                Al menos 6 caracteres
              </div>
              <div className={`flex items-center gap-2 ${validations.hasNumber ? 'text-green-400' : 'text-slate-500'}`}>
                <Icon name="check-circle" className={validations.hasNumber ? 'opacity-100' : 'opacity-50'} />
                Contiene un número
              </div>
              <div className={`flex items-center gap-2 ${validations.hasUppercase ? 'text-green-400' : 'text-slate-500'}`}>
                <Icon name="check-circle" className={validations.hasUppercase ? 'opacity-100' : 'opacity-50'} />
                Contiene una mayúscula
              </div>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-semibold mb-2">
              Confirmar Contraseña
            </label>
            <div className="relative">
              <Icon
                name="lock"
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full pl-10 pr-12 py-3 bg-slate-800/50 border border-slate-700 rounded-lg focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30 transition-all"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300"
              >
                <Icon name={showConfirmPassword ? 'eye-slash' : 'eye'} />
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-start gap-3 p-4 bg-red-500/20 border border-red-500/50 rounded-lg">
              <Icon name="exclamation-circle" className="text-red-400 mt-0.5 shrink-0" />
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 bg-linear-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-lg hover:shadow-lg hover:shadow-cyan-500/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
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

        {/* Google Sign-In */}
        <GoogleSignInButton />
      </div>
    </div>
  );
};
