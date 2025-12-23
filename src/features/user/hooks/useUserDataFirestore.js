import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import UserFirestoreService from '../services/UserFirestoreService';

/**
 * Hook para gestionar datos del usuario
 * Proporciona acceso a perfil, preferencias y métodos para actualizar
 */
export function useUserDataFirestore() {
  const { user } = useAuth();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadUserData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (!user?.uid) {
        setUserData(null);
        return;
      }

      const profile = await UserFirestoreService.getUserProfile(user.uid);
      setUserData(profile);
    } catch (err) {
      console.error('Error cargando datos del usuario:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user?.uid]);

  // Cargar datos del usuario al montar o cuando cambia user.uid
  useEffect(() => {
    if (user?.uid) {
      loadUserData();
    }
  }, [user?.uid, loadUserData]);

  // Actualizar perfil
  const updateProfile = useCallback(async (updates) => {
    if (!user?.uid) throw new Error('Usuario no autenticado');

    try {
      setLoading(true);
      const updated = await UserFirestoreService.updateUserProfile(user.uid, updates);
      setUserData(updated);
      return updated;
    } catch (err) {
      console.error('Error actualizando perfil:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [user?.uid]);

  // Actualizar nombre de usuario
  const updateUsername = useCallback(async (username) => {
    if (!user?.uid) throw new Error('Usuario no autenticado');

    try {
      const updated = await UserFirestoreService.updateUsername(user.uid, username);
      setUserData(updated);
      return updated;
    } catch (err) {
      console.error('Error actualizando nombre:', err);
      setError(err.message);
      throw err;
    }
  }, [user?.uid]);

  // Actualizar biografía
  const updateBio = useCallback(async (bio) => {
    if (!user?.uid) throw new Error('Usuario no autenticado');

    try {
      const updated = await UserFirestoreService.updateUserBio(user.uid, bio);
      setUserData(updated);
      return updated;
    } catch (err) {
      console.error('Error actualizando biografía:', err);
      setError(err.message);
      throw err;
    }
  }, [user?.uid]);

  // Actualizar foto de perfil
  const updateProfileImage = useCallback(async (photoURL) => {
    if (!user?.uid) throw new Error('Usuario no autenticado');

    try {
      const updated = await UserFirestoreService.updateProfileImage(user.uid, photoURL);
      setUserData(updated);
      return updated;
    } catch (err) {
      console.error('Error actualizando foto:', err);
      setError(err.message);
      throw err;
    }
  }, [user?.uid]);

  // Obtener preferencias
  const getPreferences = useCallback(async () => {
    if (!user?.uid) throw new Error('Usuario no autenticado');

    try {
      return await UserFirestoreService.getUserPreferences(user.uid);
    } catch (err) {
      console.error('Error obteniendo preferencias:', err);
      throw err;
    }
  }, [user?.uid]);

  // Actualizar preferencias
  const updatePreferences = useCallback(async (preferences) => {
    if (!user?.uid) throw new Error('Usuario no autenticado');

    try {
      const updated = await UserFirestoreService.updateUserPreferences(user.uid, preferences);
      setUserData(prev => ({
        ...prev,
        preferences: updated
      }));
      return updated;
    } catch (err) {
      console.error('Error actualizando preferencias:', err);
      setError(err.message);
      throw err;
    }
  }, [user?.uid]);

  // Agregar monedas
  const addMoney = useCallback(async (amount, reason = 'bonus') => {
    if (!user?.uid) throw new Error('Usuario no autenticado');

    try {
      const updated = await UserFirestoreService.addVirtualMoney(user.uid, amount, reason);
      setUserData(updated);
      return updated.virtualMoney;
    } catch (err) {
      console.error('Error agregando monedas:', err);
      setError(err.message);
      throw err;
    }
  }, [user?.uid]);

  // Gastar monedas
  const spendMoney = useCallback(async (amount, reason = 'purchase') => {
    if (!user?.uid) throw new Error('Usuario no autenticado');

    try {
      const updated = await UserFirestoreService.spendVirtualMoney(user.uid, amount, reason);
      setUserData(updated);
      return updated.virtualMoney;
    } catch (err) {
      console.error('Error gastando monedas:', err);
      setError(err.message);
      throw err;
    }
  }, [user?.uid]);

  // Agregar badge
  const addBadge = useCallback(async (badgeId) => {
    if (!user?.uid) throw new Error('Usuario no autenticado');

    try {
      const updated = await UserFirestoreService.addBadge(user.uid, badgeId);
      setUserData(updated);
      return updated.badges;
    } catch (err) {
      console.error('Error agregando badge:', err);
      setError(err.message);
      throw err;
    }
  }, [user?.uid]);

  // Recargar datos
  const refresh = useCallback(() => {
    return loadUserData();
  }, [loadUserData]);

  return {
    user: userData,
    loading,
    error,
    updateProfile,
    updateUsername,
    updateBio,
    updateProfileImage,
    getPreferences,
    updatePreferences,
    addMoney,
    spendMoney,
    addBadge,
    refresh
  };
}
