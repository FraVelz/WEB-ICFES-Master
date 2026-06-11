'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/features/auth/context/AuthContext';
import { buildLevelAssessmentUrl } from '@/features/auth/constants/skillLevelRoutes';
import { mapSupabaseAuthError, REQUIRES_EMAIL_CONFIRMATION } from '@/features/auth/utils/mapSupabaseAuthError';

export type SignupFormData = {
  displayName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export type PasswordValidations = {
  minLength: boolean;
  hasNumber: boolean;
  hasUppercase: boolean;
};

export function useSignupForm() {
  const { signup } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState<SignupFormData>({
    displayName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [onboardingAnswers, setOnboardingAnswers] = useState<unknown>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validations, setValidations] = useState<PasswordValidations>({
    minLength: false,
    hasNumber: false,
    hasUppercase: false,
  });

  useEffect(() => {
    const answers = sessionStorage.getItem('onboardingAnswers');
    if (answers) {
      setOnboardingAnswers(JSON.parse(answers));
    }
  }, []);

  const validatePassword = (pass: string) => {
    setValidations({
      minLength: pass.length >= 6,
      hasNumber: /[0-9]/.test(pass),
      hasUppercase: /[A-Z]/.test(pass),
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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

  return {
    formData,
    onboardingAnswers,
    showPassword,
    setShowPassword,
    showConfirmPassword,
    setShowConfirmPassword,
    error,
    successMessage,
    isSubmitting,
    validations,
    handleChange,
    handleSubmit,
    router,
  };
}
