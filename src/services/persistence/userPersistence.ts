/**
 * Usuario (perfil, monedas) — Supabase `users`.
 */
import UserSupabaseService from '@/services/supabase/UserSupabaseService';
import type { MappedUser } from '@/services/supabase/UserSupabaseService';
import type { UserProfile } from '@/storage/userProfile';
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
  return UserSupabaseService.updateProfile(uid, { username });
}

export async function setUserBio(uid: string, bio: string): Promise<MappedUser | UserProfile | null> {
  return UserSupabaseService.updateProfile(uid, { bio });
}

export async function setUserProfileImage(uid: string, file: File | null): Promise<MappedUser | UserProfile | null> {
  const reader = new FileReader();
  return new Promise((resolve, reject) => {
    reader.onload = async () => {
      if (!file) {
        resolve(await UserSupabaseService.updateProfile(uid, { profileImage: null }));
        return;
      }
      resolve(
        await UserSupabaseService.updateProfile(uid, {
          profileImage: reader.result,
        })
      );
    };
    reader.onerror = () => reject(new Error('Error al leer la imagen'));
    reader.readAsDataURL(file || new Blob());
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
