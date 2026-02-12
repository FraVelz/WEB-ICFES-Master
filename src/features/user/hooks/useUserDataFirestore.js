import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getUserProfile, updateUserProfile, updateUsername, updateUserBio, updateProfileImage as updateProfileImageUtil, addVirtualMoney, removeVirtualMoney, getVirtualMoney } from '@/shared/utils/userProfile';

/**
 * Hook para gestionar datos del usuario (localStorage)
 */
export function useUserDataFirestore() {
  const { user } = useAuth();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadUserData = useCallback(() => {
    if (!user?.uid) {
      setUserData(null);
      setLoading(false);
      return;
    }
    setUserData(getUserProfile());
    setLoading(false);
  }, [user?.uid]);

  useEffect(() => {
    loadUserData();
  }, [loadUserData]);

  const updateProfile = useCallback(async (updates) => {
    const updated = updateUserProfile(updates);
    setUserData(updated);
    return updated;
  }, []);

  const updateProfileUsername = useCallback(async (username) => {
    const updated = await updateUsername(username);
    setUserData(getUserProfile());
    return updated;
  }, []);

  const updateBio = useCallback(async (bio) => {
    const updated = await updateUserBio(bio);
    setUserData(getUserProfile());
    return updated;
  }, []);

  const updateProfileImage = useCallback(async (file) => {
    const updated = await updateProfileImageUtil(file);
    setUserData(getUserProfile());
    return updated;
  }, []);

  const getPreferences = useCallback(() => ({}), []);
  const updatePreferences = useCallback(() => ({}), []);

  const addMoney = useCallback((amount) => {
    addVirtualMoney(amount);
    setUserData(getUserProfile());
    return getVirtualMoney();
  }, []);

  const spendMoney = useCallback((amount) => {
    removeVirtualMoney(amount);
    setUserData(getUserProfile());
    return getVirtualMoney();
  }, []);

  const addBadge = useCallback(() => [], []);

  return {
    user: userData,
    loading,
    error,
    updateProfile,
    updateUsername: updateProfileUsername,
    updateBio,
    updateProfileImage,
    getPreferences,
    updatePreferences,
    addMoney,
    spendMoney,
    addBadge,
    refresh: loadUserData
  };
}
