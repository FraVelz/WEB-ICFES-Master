/**
 * Hook para gestionar datos del usuario (Supabase o localStorage)
 */
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import API_CONFIG from '@/services/api.config';
import UserSupabaseService from '@/services/supabase/UserSupabaseService';
import {
  getUserProfile,
  updateUserProfile,
  updateUsername,
  updateUserBio,
  updateProfileImage as updateProfileImageUtil,
  addVirtualMoney,
  removeVirtualMoney,
  getVirtualMoney,
} from '@/shared/utils/userProfile';

export function useUserData() {
  const { user } = useAuth();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadUserData = useCallback(async () => {
    if (!user?.uid) {
      setUserData(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      if (API_CONFIG.MODE === 'supabase') {
        const profile = await UserSupabaseService.getByUserId(user.uid);
        if (!profile) {
          await UserSupabaseService.createUser(user.uid, {
            email: user.email,
            displayName: user.displayName,
            username: user.displayName,
          });
          const created = await UserSupabaseService.getByUserId(user.uid);
          setUserData(created);
        } else {
          setUserData(profile);
        }
      } else {
        setUserData(getUserProfile());
      }
      setError(null);
    } catch (err) {
      setError(err?.message || 'Error cargando datos');
      setUserData(null);
    } finally {
      setLoading(false);
    }
  }, [user?.uid, user?.email, user?.displayName]);

  useEffect(() => {
    loadUserData();
  }, [loadUserData]);

  const updateProfile = useCallback(
    async (updates) => {
      if (!user?.uid) return null;
      if (API_CONFIG.MODE === 'supabase') {
        const updated = await UserSupabaseService.updateProfile(
          user.uid,
          updates
        );
        setUserData(updated);
        return updated;
      }
      const updated = updateUserProfile(updates);
      setUserData(updated);
      return updated;
    },
    [user?.uid]
  );

  const updateProfileUsername = useCallback(
    async (username) => {
      if (API_CONFIG.MODE === 'supabase') {
        return updateProfile({ username });
      }
      const updated = await updateUsername(username);
      setUserData(getUserProfile());
      return updated;
    },
    [updateProfile]
  );

  const updateBio = useCallback(
    async (bio) => {
      if (API_CONFIG.MODE === 'supabase') {
        return updateProfile({ bio });
      }
      const updated = await updateUserBio(bio);
      setUserData(getUserProfile());
      return updated;
    },
    [updateProfile]
  );

  const updateProfileImage = useCallback(
    async (file) => {
      if (API_CONFIG.MODE === 'supabase') {
        const reader = new FileReader();
        return new Promise((resolve, reject) => {
          reader.onload = async () => {
            if (!file) return updateProfile({ profileImage: null });
            const updated = await UserSupabaseService.updateProfile(user.uid, {
              profileImage: reader.result,
            });
            setUserData(updated);
            resolve(updated);
          };
          reader.onerror = () => reject(new Error('Error al leer la imagen'));
          reader.readAsDataURL(file || new Blob());
        });
      }
      const updated = await updateProfileImageUtil(file);
      setUserData(getUserProfile());
      return updated;
    },
    [user?.uid, updateProfile]
  );

  const addMoney = useCallback(
    async (amount) => {
      if (!user?.uid) return 0;
      if (API_CONFIG.MODE === 'supabase') {
        await UserSupabaseService.updateVirtualMoney(user.uid, amount);
        const updated = await UserSupabaseService.getByUserId(user.uid);
        setUserData(updated);
        return updated?.virtualMoney ?? 0;
      }
      addVirtualMoney(amount);
      setUserData(getUserProfile());
      return getVirtualMoney();
    },
    [user?.uid]
  );

  const spendMoney = useCallback(
    async (amount) => {
      if (!user?.uid) return 0;
      if (API_CONFIG.MODE === 'supabase') {
        const profile = await UserSupabaseService.getByUserId(user.uid);
        const current = profile?.virtualMoney ?? 0;
        if (current < amount) throw new Error('Monedas insuficientes');
        await UserSupabaseService.updateProfile(user.uid, {
          virtualMoney: current - amount,
        });
        const updated = await UserSupabaseService.getByUserId(user.uid);
        setUserData(updated);
        return updated?.virtualMoney ?? 0;
      }
      removeVirtualMoney(amount);
      setUserData(getUserProfile());
      return getVirtualMoney();
    },
    [user?.uid]
  );

  const addBadge = useCallback(() => [], []);

  return {
    user: userData,
    loading,
    error,
    updateProfile,
    updateUsername: updateProfileUsername,
    updateBio,
    updateProfileImage,
    getPreferences: () => ({}),
    updatePreferences: () => ({}),
    addMoney,
    spendMoney,
    addBadge,
    refresh: loadUserData,
  };
}
