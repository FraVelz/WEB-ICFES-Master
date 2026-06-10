/**
 * Usuario (perfil, monedas) — Supabase `users`.
 */
import UserSupabaseService from '@/services/supabase/UserSupabaseService';
import type { MappedUser } from '@/services/supabase/UserSupabaseService';
import type { UserProfile } from '@/features/user/types/userProfile.types';
import { addCoinsBalance, getCoinsBalance, spendCoinsBalance } from './coinsPersistence';

export const USER_PROFILE_CHANGE_EVENT = 'icfes:user-profile-changed';

export type UserProfileChangeDetail = {
  profileImage?: string | null;
  username?: string | null;
  bio?: string | null;
};

export function emitUserProfileChanged(detail?: UserProfileChangeDetail) {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(USER_PROFILE_CHANGE_EVENT, { detail }));
  }
}

export async function loadUserProfile(
  uid: string,
  email: string | null,
  displayName: string | null
): Promise<MappedUser | UserProfile | null> {
  const profile = await UserSupabaseService.getByUserId(uid);
  if (!profile) {
    await UserSupabaseService.createUser(uid, {
      email,
      displayName,
      username: displayName,
    });
    return UserSupabaseService.getByUserId(uid);
  }
  return profile;
}

export async function patchUserProfile(
  uid: string,
  updates: Partial<UserProfile> | Record<string, unknown>
): Promise<MappedUser | UserProfile | null> {
  const updated = await UserSupabaseService.updateProfile(uid, updates);
  emitUserProfileChanged({
    profileImage: updated.profileImage,
    username: updated.username,
    bio: updated.bio,
  });
  return updated;
}

export async function setUsername(uid: string, username: string): Promise<MappedUser | UserProfile | null> {
  if (!username.trim()) {
    throw new Error('El nombre de usuario no puede estar vacío');
  }
  if (username.length > 30) {
    throw new Error('El nombre de usuario no puede exceder 30 caracteres');
  }
  const updated = await UserSupabaseService.updateProfile(uid, { username: username.trim() });
  emitUserProfileChanged({ username: updated.username });
  return updated;
}

export async function setUserBio(uid: string, bio: string): Promise<MappedUser | UserProfile | null> {
  if (bio.length > 150) {
    throw new Error('La biografía no puede exceder 150 caracteres');
  }
  const updated = await UserSupabaseService.updateProfile(uid, { bio: bio.trim() });
  emitUserProfileChanged({ bio: updated.bio });
  return updated;
}

export async function setUserProfileImage(uid: string, file: File | null): Promise<MappedUser | UserProfile | null> {
  if (!file) {
    const updated = await UserSupabaseService.updateProfile(uid, { profileImage: null });
    emitUserProfileChanged({ profileImage: null });
    return updated;
  }

  if (!file.type.startsWith('image/')) {
    throw new Error('El archivo debe ser una imagen');
  }
  if (file.size > 2 * 1024 * 1024) {
    throw new Error('La imagen no puede exceder 2MB');
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async () => {
      const updated = await UserSupabaseService.updateProfile(uid, {
        profileImage: reader.result as string,
      });
      emitUserProfileChanged({ profileImage: updated.profileImage });
      resolve(updated);
    };
    reader.onerror = () => reject(new Error('Error al leer la imagen'));
    reader.readAsDataURL(file);
  });
}

export async function addUserMoney(uid: string, amount: number): Promise<MappedUser | UserProfile | null> {
  await addCoinsBalance(uid, amount, 'user_wallet');
  const profile = await UserSupabaseService.getByUserId(uid);
  if (!profile) return null;
  const balance = await getCoinsBalance(uid);
  return { ...profile, coinsBalance: balance };
}

export async function spendUserMoney(uid: string, amount: number): Promise<MappedUser | UserProfile | null> {
  await spendCoinsBalance(uid, amount, 'user_wallet');
  const profile = await UserSupabaseService.getByUserId(uid);
  if (!profile) return null;
  const balance = await getCoinsBalance(uid);
  return { ...profile, coinsBalance: balance };
}
