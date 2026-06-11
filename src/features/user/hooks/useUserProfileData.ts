import { useState, useEffect } from 'react';
import { useAuth } from '@/features/auth/context/AuthContext';
import { getDemoProfile } from '@/services/demo/demoProfile';
import { isDemoUserId } from '@/services/demo/demoCoins';
import UserSupabaseService from '@/services/supabase/UserSupabaseService';
import { isSupabaseConfigured } from '@/services/persistence/supabaseConfigured';
import { USER_PROFILE_CHANGE_EVENT, type UserProfileChangeDetail } from '@/services/persistence';

export type UserProfileData = {
  profileImage: string | null;
  name: string;
  personalPhrase: string;
  createdAt: string;
  loading: boolean;
  exists: boolean;
};

const EMPTY_PROFILE: UserProfileData = {
  profileImage: null,
  name: '',
  personalPhrase: '',
  createdAt: 'Reciente',
  loading: true,
  exists: false,
};

export function useUserProfileData(uid: string | undefined) {
  const { user: authUser, loading: authLoading } = useAuth();
  const isOwnProfile = Boolean(authUser?.uid && uid === authUser.uid);
  const [profileData, setProfileData] = useState<UserProfileData>(EMPTY_PROFILE);

  useEffect(() => {
    if (!uid) {
      if (!authLoading) {
        setProfileData((prev) => ({ ...prev, loading: false, exists: false }));
      }
      return;
    }

    let cancelled = false;

    const load = async () => {
      const canShowAuthShell = Boolean(isOwnProfile && authUser);
      if (!canShowAuthShell) {
        setProfileData((prev) => ({ ...prev, loading: true }));
      }

      if (isDemoUserId(uid)) {
        const demo = getDemoProfile();
        if (cancelled) return;
        setProfileData({
          profileImage: null,
          name: demo.username ?? 'Estudiante',
          personalPhrase: demo.bio ?? '',
          createdAt: 'Modo demo',
          loading: false,
          exists: true,
        });
        return;
      }

      if (!isSupabaseConfigured()) {
        if (cancelled) return;
        setProfileData((prev) => ({ ...prev, loading: false, exists: false }));
        return;
      }

      try {
        const profile = await UserSupabaseService.getByUserId(uid);
        if (cancelled) return;

        if (!profile) {
          setProfileData((prev) => ({ ...prev, loading: false, exists: false }));
          return;
        }

        setProfileData({
          profileImage: profile.profileImage ?? (isOwnProfile ? (authUser?.profileImage ?? null) : null),
          name: profile.username ?? profile.displayName ?? 'Usuario',
          personalPhrase: profile.bio ?? '¡Preparándome para el éxito!',
          createdAt: profile.createdAt
            ? new Date(profile.createdAt).toLocaleDateString('es-CO', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })
            : 'Reciente',
          loading: false,
          exists: true,
        });
      } catch {
        if (!cancelled) {
          setProfileData((prev) => ({ ...prev, loading: false, exists: false }));
        }
      }
    };

    void load();
    return () => {
      cancelled = true;
    };
  }, [uid, authUser, isOwnProfile, authLoading]);

  useEffect(() => {
    if (!isOwnProfile || !authUser?.uid || authLoading) return;

    setProfileData((prev) => ({
      ...prev,
      profileImage: authUser.profileImage ?? prev.profileImage,
      name: authUser.displayName ?? prev.name ?? 'Usuario',
      exists: true,
      loading: false,
    }));
  }, [isOwnProfile, authUser, authLoading]);

  useEffect(() => {
    if (!isOwnProfile) return;

    const onProfileChanged = (event: Event) => {
      const detail = (event as CustomEvent<UserProfileChangeDetail>).detail;
      if (!detail) return;

      setProfileData((prev) => ({
        ...prev,
        ...(detail.profileImage !== undefined ? { profileImage: detail.profileImage } : {}),
        ...(detail.username !== undefined ? { name: detail.username ?? prev.name } : {}),
        ...(detail.bio !== undefined ? { personalPhrase: detail.bio ?? prev.personalPhrase } : {}),
      }));
    };

    window.addEventListener(USER_PROFILE_CHANGE_EVENT, onProfileChanged);
    return () => window.removeEventListener(USER_PROFILE_CHANGE_EVENT, onProfileChanged);
  }, [isOwnProfile]);

  return { profileData, isOwnProfile, authLoading };
}
