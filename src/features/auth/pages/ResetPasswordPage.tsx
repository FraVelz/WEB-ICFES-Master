'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Icon } from '@/shared/components/Icon';
import { EMAIL_MESSAGES } from '@/config/emailMessages';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/config/supabase';

export const ResetPasswordPage = () => {
  const router = useRouter();
  const { updatePassword } = useAuth();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [verifying, setVerifying] = useState(true);
  const [hasRecoverySession, setHasRecoverySession] = useState(false);

  // Supabase: verificar si hay sesión de recuperación (hash en URL)
  useEffect(() => {
    const checkSession = async () => {
      if (!supabase) {
        setError('Supabase no configurado');
        setVerifying(false);
        return;
      }
      const { data: { session } } = await supabase.auth.getSession();
      setHasRecoverySession(!!session);
      setVerifying(false);
      if (!session) {
        setError('Enlace de recuperación inválido o expirado. Solicita uno nuevo.');
      }
    };
    checkSession();
  }, []);

  const validatePassword = (pwd) => {
    if (pwd.length < 6) {
      return EMAIL_MESSAGES.resetPasswordPage.errorPasswordTooShort;
    }
    if (!/[A-Z]/.test(pwd)) {
      return EMAIL_MESSAGES.resetPasswordPage.errorPasswordNoUppercase;
    }
    if (!/[0-9]/.test(pwd)) {
      return EMAIL_MESSAGES.resetPasswordPage.errorPasswordNoNumber;
    }
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validaciones
    if (!password || !confirmPassword) {
      setError(EMAIL_MESSAGES.resetPasswordPage.errorEmptyFields);
      return;
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    if (password !== confirmPassword) {
      setError(EMAIL_MESSAGES.resetPasswordPage.errorPasswordsDoNotMatch);
      return;
    }

    setIsLoading(true);

    try {
      await updatePassword(password);
      setSuccess(true);
      setTimeout(() => router.push('/login'), 3000);
    } catch (err) {
      setError(err?.message || EMAIL_MESSAGES.resetPasswordPage.errorGeneric);
    } finally {
      setIsLoading(false);
    }
  };

  if (verifying) {
    return (
      <div className="min-h-dvh bg-linear-to-b from-black via-slate-950 to-black text-white flex items-center justify-center px-6 overflow-hidden">
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl animate-pulse"></div>
        </div>

        <div className="relative z-10 text-center">
          <p className="text-xl">Verificando tu enlace de recuperación...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-linear-to-b from-black via-slate-950 to-black text-white flex items-center justify-center px-6 overflow-hidden">
      {/* Background glow effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl animate-pulse"></div>
      </div>

      {/* Card */}
      <div className="relative z-10 w-full max-w-md">
        {/* Success State */}
        {success ? (
          <div className="text-center space-y-6">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 rounded-full bg-green-500/20 border border-green-500/50 flex items-center justify-center animate-pulse">
                <Icon name="check-circle" size="2xl" className="text-green-400 text-4xl" />
              </div>
            </div>

            <div>
              <h1 className="text-3xl md:text-4xl font-black mb-4 bg-linear-to-r from-green-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
                {EMAIL_MESSAGES.resetPasswordPage.successTitle}
              </h1>
              <p className="text-slate-400">
                {EMAIL_MESSAGES.resetPasswordPage.successMessage}
              </p>
            </div>

            <Link
              href="/login"
              className="block py-3 px-4 bg-linear-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-lg hover:shadow-lg hover:shadow-cyan-500/50 transition-all text-center"
            >
              {EMAIL_MESSAGES.resetPasswordPage.goToLoginButton}
            </Link>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-full bg-cyan-500/20 border border-cyan-500/50 flex items-center justify-center">
                  <Icon name="lock" size="2xl" className="text-cyan-400 text-2xl" />
                </div>
              </div>
              <h1 className="text-3xl md:text-4xl font-black mb-4 bg-linear-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                {EMAIL_MESSAGES.resetPasswordPage.title}
              </h1>
              <p className="text-slate-400">
                {EMAIL_MESSAGES.resetPasswordPage.subtitle}
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 flex items-start gap-3 p-4 bg-red-500/20 border border-red-500/50 rounded-lg">
                <Icon name="exclamation-circle" className="text-red-400 mt-0.5 shrink-0" />
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-semibold mb-2">
                  {EMAIL_MESSAGES.resetPasswordPage.newPasswordLabel}
                </label>
                <div className="relative">
                <Icon
                  name="lock"
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={EMAIL_MESSAGES.resetPasswordPage.passwordPlaceholder}
                    className="w-full pl-10 pr-10 py-3 bg-slate-800/50 border border-slate-700 rounded-lg focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300"
                  >
                    <Icon name={showPassword ? 'eye-slash' : 'eye'} />
                  </button>
                </div>
              </div>

              {/* Confirm Password Field */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-semibold mb-2">
                  {EMAIL_MESSAGES.resetPasswordPage.confirmPasswordLabel}
                </label>
                <div className="relative">
                <Icon
                  name="lock"
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder={EMAIL_MESSAGES.resetPasswordPage.passwordPlaceholder}
                    className="w-full pl-10 pr-10 py-3 bg-slate-800/50 border border-slate-700 rounded-lg focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30 transition-all"
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

              {/* Password Requirements */}
              <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-4">
                <p className="text-xs font-semibold text-slate-300 mb-2">{EMAIL_MESSAGES.resetPasswordPage.requirementsTitle}</p>
                <ul className="text-xs text-slate-400 space-y-1">
                  <li className={password.length >= 6 ? 'text-green-400' : ''}>
                    ✓ {EMAIL_MESSAGES.resetPasswordPage.requirement1}
                  </li>
                  <li className={/[A-Z]/.test(password) ? 'text-green-400' : ''}>
                    ✓ {EMAIL_MESSAGES.resetPasswordPage.requirement2}
                  </li>
                  <li className={/[0-9]/.test(password) ? 'text-green-400' : ''}>
                    ✓ {EMAIL_MESSAGES.resetPasswordPage.requirement3}
                  </li>
                  <li className={password === confirmPassword && password ? 'text-green-400' : ''}>
                    ✓ {EMAIL_MESSAGES.resetPasswordPage.requirement4}
                  </li>
                </ul>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 bg-linear-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-lg hover:shadow-lg hover:shadow-cyan-500/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? EMAIL_MESSAGES.resetPasswordPage.buttonLoadingText : EMAIL_MESSAGES.resetPasswordPage.buttonText}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};
