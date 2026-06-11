'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { EMAIL_MESSAGES } from '@/config/emailMessages';
import { useAuth } from '@/features/auth/context/AuthContext';
import { supabase } from '@/config/supabase';
import { mapSupabaseAuthError } from '@/features/auth/utils/mapSupabaseAuthError';

export function useResetPassword() {
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

  useEffect(() => {
    const checkSession = async () => {
      if (!supabase) {
        setError('Supabase no configurado');
        setVerifying(false);
        return;
      }
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setHasRecoverySession(!!session);
      setVerifying(false);
      if (!session) {
        setError('Enlace de recuperación inválido o expirado. Solicita uno nuevo.');
      }
    };
    void checkSession();
  }, []);

  const validatePassword = (pwd: string): string => {
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

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
      setError(mapSupabaseAuthError(err, EMAIL_MESSAGES.resetPasswordPage.errorGeneric));
    } finally {
      setIsLoading(false);
    }
  };

  return {
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    isLoading,
    error,
    success,
    showPassword,
    setShowPassword,
    showConfirmPassword,
    setShowConfirmPassword,
    verifying,
    hasRecoverySession,
    handleSubmit,
  };
}
