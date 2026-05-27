'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/features/auth/context/AuthContext';
import { useUser } from '@/features/user/hooks/useUser';
import { useUserData } from '@/features/user/hooks/useUserData';
import { useProgress } from '@/features/user/hooks/useProgress';
import { useExam } from '@/features/exam/hooks/useExam';
import { updateUsername, updateUserBio, updateProfileImage } from '@/services/persistence';

export function useUserSettings() {
  const router = useRouter();
  const { user, refreshUser } = useUser();
  const { logout } = useAuth();
  const { user: userData } = useUserData();
  const { resetProgress } = useProgress();
  const { resetUserExams } = useExam(undefined);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  const [supportMode, setSupportMode] = useState('response');
  const [supportCategory, setSupportCategory] = useState('technical');
  const [supportMessage, setSupportMessage] = useState('');
  const [supportEmail, setSupportEmail] = useState('');
  const [sendingSupport, setSendingSupport] = useState(false);

  useEffect(() => {
    setUsername(user?.username ?? userData?.displayName ?? userData?.username ?? '');
    setSupportEmail((user?.email ?? userData?.email ?? '') as string);
  }, [user?.username, user?.email, userData?.displayName, userData?.username, userData?.email]);

  useEffect(() => {
    setBio(user?.bio || userData?.bio || '');
  }, [user?.bio, userData?.bio]);

  const showMessage = (msg: string, type: 'success' | 'error' = 'success') => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => setMessage(''), 3000);
  };

  const handleUsernameUpdate = async () => {
    if (!username.trim()) {
      showMessage('El nombre de usuario no puede estar vacío', 'error');
      return;
    }
    try {
      setLoading(true);
      await updateUsername(username);
      refreshUser();
      showMessage('Nombre de usuario actualizado');
    } catch (err) {
      showMessage(`Error: ${err instanceof Error ? err.message : 'Error desconocido'}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleBioUpdate = async () => {
    try {
      setLoading(true);
      await updateUserBio(bio);
      refreshUser();
      showMessage('Frase personal actualizada');
    } catch (err) {
      showMessage(`Error: ${err instanceof Error ? err.message : 'Error desconocido'}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setLoading(true);
      await updateProfileImage(file);
      await refreshUser();
      showMessage('Foto de perfil actualizada');
    } catch (err) {
      showMessage(`Error: ${err instanceof Error ? err.message : 'Error desconocido'}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveProfileImage = async () => {
    try {
      setLoading(true);
      await updateProfileImage(null);
      await refreshUser();
      showMessage('Foto de perfil eliminada');
    } finally {
      setLoading(false);
    }
  };

  const handleSupportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supportMessage.trim()) {
      showMessage('Por favor describe tu problema o pregunta', 'error');
      return;
    }
    if (supportMode === 'response' && !supportEmail.trim()) {
      showMessage('Por favor ingresa un email para responderte', 'error');
      return;
    }
    try {
      setSendingSupport(true);
      showMessage('Gracias 🙌 Tu mensaje se ha registrado. Te responderemos pronto.', 'success');
      setSupportMessage('');
      setSupportCategory('technical');
      if (!user?.email && !userData?.email) setSupportEmail('');
    } catch (err) {
      console.error('Error sending support message:', err);
      showMessage('Error al enviar el mensaje. Intenta nuevamente.', 'error');
    } finally {
      setSendingSupport(false);
    }
  };

  const handleLogout = async () => {
    try {
      setLoading(true);
      await logout();
      showMessage('Sesión cerrada exitosamente', 'success');
      setTimeout(() => router.push('/'), 1500);
    } catch (err) {
      showMessage(`Error al cerrar sesión: ${err instanceof Error ? err.message : 'Error desconocido'}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleClearAllData = async () => {
    if (deleteConfirmation !== 'BORRAR TODO') {
      showMessage('Escribe "BORRAR TODO" para confirmar', 'error');
      return;
    }
    try {
      setLoading(true);
      await resetProgress();
      await resetUserExams();
      localStorage.clear();
      sessionStorage.clear();
      showMessage('Todos tus datos han sido eliminados', 'success');
      setShowDeleteModal(false);
      setDeleteConfirmation('');
      setTimeout(() => router.push('/dashboard'), 1500);
    } catch (err) {
      showMessage(`Error al eliminar datos: ${err instanceof Error ? err.message : 'Error desconocido'}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmation !== 'BORRAR MI CUENTA') {
      showMessage('Escribe "BORRAR MI CUENTA" para confirmar', 'error');
      return;
    }
    try {
      setLoading(true);
      await resetProgress();
      await resetUserExams();
      localStorage.clear();
      sessionStorage.clear();
      await logout();
      showMessage('Cuenta eliminada exitosamente', 'success');
      setTimeout(() => router.push('/'), 1500);
    } catch (err) {
      showMessage(`Error al eliminar cuenta: ${err instanceof Error ? err.message : 'Error desconocido'}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    fileInputRef,
    message,
    messageType,
    loading,
    username,
    setUsername,
    bio,
    setBio,
    showDeleteModal,
    setShowDeleteModal,
    deleteConfirmation,
    setDeleteConfirmation,
    supportMode,
    setSupportMode,
    supportCategory,
    setSupportCategory,
    supportMessage,
    setSupportMessage,
    supportEmail,
    setSupportEmail,
    sendingSupport,
    handleUsernameUpdate,
    handleBioUpdate,
    handleImageUpload,
    handleRemoveProfileImage,
    handleSupportSubmit,
    handleLogout,
    handleClearAllData,
    handleDeleteAccount,
  };
}

export type UserSettingsContextValue = ReturnType<typeof useUserSettings>;
