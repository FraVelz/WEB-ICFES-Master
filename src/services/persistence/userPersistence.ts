/**
 * Usuario (perfil, monedas) — Supabase `users`.
 */
import UserSupabaseService from '@/services/supabase/UserSupabaseService';
import type { MappedUser } from '@/services/supabase/UserSupabaseService';
import type { UserProfile } from '@/features/user/types/userProfile.types';
import { addCoinsBalance, getCoinsBalance, spendCoinsBalance } from './coinsPersistence';

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
  return UserSupabaseService.updateProfile(uid, updates);
}

export async function setUsername(uid: string, username: string): Promise<MappedUser | UserProfile | null> {
  if (!username.trim()) {
    throw new Error('El nombre de usuario no puede estar vacío');
  }
  if (username.length > 30) {
    throw new Error('El nombre de usuario no puede exceder 30 caracteres');
  }
  return UserSupabaseService.updateProfile(uid, { username: username.trim() });
}

export async function setUserBio(uid: string, bio: string): Promise<MappedUser | UserProfile | null> {
  if (bio.length > 150) {
    throw new Error('La biografía no puede exceder 150 caracteres');
  }
  return UserSupabaseService.updateProfile(uid, { bio: bio.trim() });
}

export async function setUserProfileImage(uid: string, file: File | null): Promise<MappedUser | UserProfile | null> {
  if (!file) {
    return UserSupabaseService.updateProfile(uid, { profileImage: null });
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
      resolve(
        await UserSupabaseService.updateProfile(uid, {
          profileImage: reader.result,
        })
      );
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
  return { ...profile, virtualMoney: balance };
}

export async function spendUserMoney(uid: string, amount: number): Promise<MappedUser | UserProfile | null> {
  await spendCoinsBalance(uid, amount, 'user_wallet');
  const profile = await UserSupabaseService.getByUserId(uid);
  if (!profile) return null;
  const balance = await getCoinsBalance(uid);
  return { ...profile, virtualMoney: balance };
}
