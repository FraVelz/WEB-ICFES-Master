'use client';

import { useAuth } from '@/features/auth/context/AuthContext';
import type { useUserSettingsState } from './useUserSettingsState';

type SettingsState = ReturnType<typeof useUserSettingsState>;

export function useUserSettingsProfileHandlers(state: SettingsState) {
  const { user: authUser } = useAuth();
  const {
    username,
    bio,
    setLoading,
    showMessage,
    updateUsername,
    updateBio,
    updateProfileImage,
    refreshUser,
    refresh,
  } = state;

  const handleUsernameUpdate = async () => {
    if (!username.trim()) {
      showMessage('El nombre de usuario no puede estar vacío', 'error');
      return;
    }
    if (username.length > 30) {
      showMessage('El nombre de usuario no puede exceder 30 caracteres', 'error');
      return;
    }
    try {
      setLoading(true);
      if (authUser?.uid) {
        await updateUsername(username.trim());
      }
      await refreshUser();
      await refresh();
      showMessage('Nombre de usuario actualizado');
    } catch (err) {
      showMessage(`Error: ${err instanceof Error ? err.message : 'Error desconocido'}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleBioUpdate = async () => {
    if (bio.length > 150) {
      showMessage('La biografía no puede exceder 150 caracteres', 'error');
      return;
    }
    try {
      setLoading(true);
      if (authUser?.uid) {
        await updateBio(bio.trim());
      }
      await refreshUser();
      await refresh();
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
    if (!file.type.startsWith('image/')) {
      showMessage('El archivo debe ser una imagen', 'error');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      showMessage('La imagen no puede exceder 2MB', 'error');
      return;
    }
    try {
      setLoading(true);
      if (authUser?.uid) {
        await updateProfileImage(file);
      }
      await refreshUser();
      await refresh();
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
      if (authUser?.uid) {
        await updateProfileImage(null);
      }
      await refreshUser();
      await refresh();
      showMessage('Foto de perfil eliminada');
    } finally {
      setLoading(false);
    }
  };

  return {
    handleUsernameUpdate,
    handleBioUpdate,
    handleImageUpload,
    handleRemoveProfileImage,
  };
}
