'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/features/auth/context/AuthContext';
import { useProgress } from '@/features/user/hooks/useProgress';
import { useExam } from '@/features/exam/hooks/useExam';
import { clearLocalClientData } from '@/services/persistence/clearLocalClientData';
import { isSupabaseConfigured } from '@/services/persistence/supabaseConfigured';
import type { useUserSettingsState } from './useUserSettingsState';

type SettingsState = ReturnType<typeof useUserSettingsState>;

export function useUserSettingsAccountHandlers(state: SettingsState) {
  const router = useRouter();
  const { logout, user: authUser } = useAuth();
  const { resetProgress } = useProgress();
  const { resetUserExams } = useExam(undefined);

  const {
    supportMode,
    supportCategory,
    supportMessage,
    supportEmail,
    user,
    userData,
    deleteConfirmation,
    setShowDeleteModal,
    setDeleteConfirmation,
    setLoading,
    showMessage,
  } = state;

  const handleSupportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!supportMessage.trim()) {
      showMessage('Por favor describe tu problema o pregunta', 'error');
      return;
    }
    if (supportMode === 'response' && !supportEmail.trim()) {
      showMessage('Por favor ingresa un email para responderte', 'error');
      return;
    }

    const subject = encodeURIComponent(
      `[ICFES Master] ${supportMode === 'report' ? 'Reporte' : 'Soporte'} — ${supportCategory}`
    );
    const body = encodeURIComponent(
      `${supportMessage.trim()}\n\n---\nEmail: ${supportEmail || user?.email || userData?.email || 'no indicado'}`
    );
    window.location.href = `mailto:fravelz@proton.me?subject=${subject}&body=${body}`;
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
      clearLocalClientData(authUser?.uid);
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
      clearLocalClientData(authUser?.uid);
      sessionStorage.clear();
      await logout();
      const suffix = isSupabaseConfigured()
        ? ' Datos locales borrados. Para eliminar la cuenta en la nube, contacta soporte.'
        : '';
      showMessage(`Sesión cerrada y datos locales eliminados.${suffix}`, 'success');
      setTimeout(() => router.push('/'), 1500);
    } catch (err) {
      showMessage(`Error al eliminar cuenta: ${err instanceof Error ? err.message : 'Error desconocido'}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  return {
    handleSupportSubmit,
    handleLogout,
    handleClearAllData,
    handleDeleteAccount,
  };
}
