'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/features/auth/context/AuthContext';
import { useProgress } from '@/features/user/hooks/useProgress';
import { useExam } from '@/features/exam/hooks/useExam';
import { clearLocalClientData } from '@/services/persistence/clearLocalClientData';
import { isSupabaseConfigured } from '@/services/persistence/supabaseConfigured';
import { isSupportCategory } from '@/features/user/constants/supportRequestConstants';
import { submitSupportRequest } from '@/services/support/supportRequestService';
import { downloadUserResultsExport } from '@/features/user/utils/exportUserResults';
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
    setSupportMessage,
    supportEmail,
    user,
    userData,
    deleteConfirmation,
    setShowDeleteModal,
    setDeleteMode,
    setDeleteConfirmation,
    setLoading,
    showMessage,
    setSupportSubmitting,
  } = state;

  const handleExportResults = () => {
    try {
      downloadUserResultsExport();
      showMessage('Resultados exportados (JSON descargado)', 'success');
    } catch (err) {
      showMessage(`Error al exportar: ${err instanceof Error ? err.message : 'Error desconocido'}`, 'error');
    }
  };

  const handleSupportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const kind = supportMode === 'report' ? 'bug' : 'contact';
    const category = isSupportCategory(supportCategory) ? supportCategory : 'other';
    const contactEmail =
      supportMode === 'response'
        ? supportEmail.trim() || user?.email || userData?.email || null
        : user?.email || userData?.email || null;

    setSupportSubmitting(true);
    const result = await submitSupportRequest({
      kind,
      category,
      message: supportMessage,
      contactEmail,
      pageUrl: typeof window !== 'undefined' ? window.location.href : null,
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : null,
    });
    setSupportSubmitting(false);

    if (!result.ok) {
      showMessage(result.error, 'error');
      return;
    }

    showMessage(
      kind === 'bug'
        ? 'Reporte enviado. Si se confirma como error real, recibirás 100 XP y 50 monedas.'
        : 'Mensaje enviado. Te responderemos pronto.',
      'success'
    );
    setSupportMessage('');
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
      setDeleteMode(null);
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
      setShowDeleteModal(false);
      setDeleteMode(null);
      setDeleteConfirmation('');
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
    handleExportResults,
    handleClearAllData,
    handleDeleteAccount,
  };
}
