/**
 * Hook para gestionar datos del usuario (Supabase o localStorage)
 */
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import type { MappedUser } from '@/services/supabase/UserSupabaseService';
import type { UserProfile } from '@/shared/utils/userProfile';
import {
  loadUserProfile,
  patchUserProfile,
  setUsername,
  setUserBio,
  setUserProfileImage,
  addUserMoney,
  spendUserMoney,
} from '@/services/persistence';

export function useUserData() {
  const { user } = useAuth();
  const [userData, setUserData] = useState<MappedUser | UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadUserData = useCallback(async () => {
    if (!user?.uid) {
      setUserData(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const data = await loadUserProfile(user.uid, user.email, user.displayName);
      setUserData(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error cargando datos');
      setUserData(null);
    } finally {
      setLoading(false);
    }
  }, [user?.uid, user?.email, user?.displayName]);

  useEffect(() => {
    loadUserData();
  }, [loadUserData]);

  const updateProfile = useCallback(
    async (updates: Partial<UserProfile> | Record<string, unknown>) => {
      if (!user?.uid) return null;
      const updated = await patchUserProfile(user.uid, updates);
      setUserData(updated);
      return updated;
    },
    [user?.uid]
  );

  const updateProfileUsername = useCallback(
    async (username: string) => {
      if (!user?.uid) return null;
      const updated = await setUsername(user.uid, username);
      setUserData(updated);
      return updated;
    },
    [user?.uid]
  );

  const updateBio = useCallback(
    async (bio: string) => {
      if (!user?.uid) return null;
      const updated = await setUserBio(user.uid, bio);
      setUserData(updated);
      return updated;
    },
    [user?.uid]
  );

  const updateProfileImage = useCallback(
    async (file: File | null) => {
      if (!user?.uid) return null;
      const updated = await setUserProfileImage(user.uid, file);
      setUserData(updated);
      return updated;
    },
    [user?.uid]
  );

  const addMoney = useCallback(
    async (amount: number) => {
      if (!user?.uid) return 0;
      const updated = await addUserMoney(user.uid, amount);
      setUserData(updated);
      return updated?.virtualMoney ?? 0;
    },
    [user?.uid]
  );

  const spendMoney = useCallback(
    async (amount: number) => {
      if (!user?.uid) return 0;
      const updated = await spendUserMoney(user.uid, amount);
      setUserData(updated);
      return updated?.virtualMoney ?? 0;
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
