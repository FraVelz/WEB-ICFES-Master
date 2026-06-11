'use client';

import { cn } from '@/utils/cn';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Icon } from '@/shared/components/Icon';
import { ThemeToggle } from '@/shared/components/ThemeToggle';
import { useAuth } from '@/features/auth/context/AuthContext';
import { AUTH_DEFAULT_REDIRECT } from '@/features/auth/constants/authRoutes';
import { mapSupabaseAuthError } from '@/features/auth/utils/mapSupabaseAuthError';
import { redirectAfterAuth } from '@/features/auth/utils/loginRedirect';
import { LoginForm } from './login/LoginForm';
import { LoginPageFooter } from './login/LoginPageFooter';

export const LoginPage = () => {
  const router = useRouter();
  const { login, isAuthenticated, loading: authLoading, user } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!authLoading && isAuthenticated && user?.uid) {
      void redirectAfterAuth(user.uid, (path) => router.replace(path));
    }
  }, [authLoading, isAuthenticated, router, user?.uid]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      const loggedIn = await login(email.trim(), password);
      if (loggedIn?.uid) {
        await redirectAfterAuth(loggedIn.uid, (path) => router.push(path));
        return;
      }
      router.push(AUTH_DEFAULT_REDIRECT);
    } catch (err) {
      setError(mapSupabaseAuthError(err, 'No se pudo iniciar sesión. Intenta de nuevo.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className={cn(
        'from-surface via-surface-via to-surface text-on-surface flex min-h-full flex-col',
        'bg-linear-to-b px-6 py-6'
      )}
    >
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="bg-ambient-a/30 absolute top-1/3 left-1/4 h-96 w-96 animate-pulse rounded-full blur-3xl" />
        <div className="bg-ambient-b/30 absolute right-1/4 bottom-1/3 h-96 w-96 animate-pulse rounded-full blur-3xl" />
      </div>

      <div className="relative z-10">
        <div className="flex items-center justify-between py-4">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="text-on-surface-muted hover:text-on-surface cursor-pointer transition-colors"
          >
            <Icon name="times" size="2xl" className="text-2xl" />
          </button>
          <h2 className="text-lg font-semibold">Ingresa tus datos</h2>
          <ThemeToggle compact />
        </div>
        <div className="via-surface-border h-px bg-linear-to-r from-transparent to-transparent" />
      </div>

      <div className="relative z-10 flex w-full flex-1 items-center justify-center py-4">
        <div className="w-full max-w-md">
          <LoginForm
            email={email}
            password={password}
            showPassword={showPassword}
            error={error}
            isSubmitting={isSubmitting}
            authLoading={authLoading}
            onEmailChange={setEmail}
            onPasswordChange={setPassword}
            onTogglePassword={() => setShowPassword(!showPassword)}
            onSubmit={handleSubmit}
          />
        </div>
      </div>

      <LoginPageFooter />
    </div>
  );
};
