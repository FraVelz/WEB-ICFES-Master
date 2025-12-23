/**
 * useUserData - Hook para acceder a datos del usuario
 * 
 * USO:
 * const { user, loading, error, updateProfile } = useUserData();
 */

import { useState, useEffect } from 'react';
import { UserService } from '@/services';

export function useUserData() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cargar perfil al montar
  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      setLoading(true);
      const profile = await UserService.getUserProfile();
      setUser(profile);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error cargando perfil:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates) => {
    try {
      if (!user?.id) throw new Error('Usuario no cargado');
      const updated = await UserService.updateProfile(user.id, updates);
      setUser(updated);
      return updated;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const updateUsername = async (username) => {
    return updateProfile({ username });
  };

  const updatePersonalPhrase = async (phrase) => {
    return updateProfile({ personalPhrase: phrase });
  };

  const updateProfileImage = async (imageBase64) => {
    return updateProfile({ profileImage: imageBase64 });
  };

  const getSettings = async () => {
    try {
      if (!user?.id) throw new Error('Usuario no cargado');
      return await UserService.getSettings(user.id);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const updateSettings = async (settings) => {
    try {
      if (!user?.id) throw new Error('Usuario no cargado');
      const updated = await UserService.updateSettings(user.id, settings);
      setUser(updated);
      return updated;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const exportData = async () => {
    try {
      if (!user?.id) throw new Error('Usuario no cargado');
      return await UserService.exportUserData(user.id);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const importData = async (backupData) => {
    try {
      if (!user?.id) throw new Error('Usuario no cargado');
      const imported = await UserService.importUserData(user.id, backupData);
      setUser(imported);
      return imported;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const deleteAccount = async () => {
    try {
      if (!user?.id) throw new Error('Usuario no cargado');
      await UserService.deleteAccount(user.id);
      setUser(null);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  return {
    user,
    loading,
    error,
    updateProfile,
    updateUsername,
    updatePersonalPhrase,
    updateProfileImage,
    getSettings,
    updateSettings,
    exportData,
    importData,
    deleteAccount,
    reload: loadUserProfile
  };
}

export default useUserData;
