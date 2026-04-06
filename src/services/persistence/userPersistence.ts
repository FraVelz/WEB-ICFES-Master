/**
 * Usuario (perfil, monedas): una sola entrada para Supabase o localStorage.
 */
import UserSupabaseService from '@/services/supabase/UserSupabaseService';
import {
  getUserProfile,
  updateUserProfile,
  updateUsername,
  updateUserBio,
  updateProfileImage as updateProfileImageUtil,
  addVirtualMoney,
  removeVirtualMoney,
} from '@/shared/utils/userProfile';
import type { MappedUser } from '@/services/supabase/UserSupabaseService';
import type { UserProfile } from '@/shared/utils/userProfile';
import { isSupabaseMode } from './apiMode';

export async function loadUserProfile(
  uid: string,
  email: string | null,
  displayName: string | null
): Promise<MappedUser | UserProfile | null> {
  if (isSupabaseMode()) {
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
  return getUserProfile();
}

export async function patchUserProfile(
  uid: string,
  updates: Partial<UserProfile> | Record<string, unknown>
): Promise<MappedUser | UserProfile | null> {
  if (isSupabaseMode()) {
    return UserSupabaseService.updateProfile(uid, updates);
  }
  return updateUserProfile(updates);
}

export async function setUsername(uid: string, username: string): Promise<MappedUser | UserProfile | null> {
  if (isSupabaseMode()) {
    return UserSupabaseService.updateProfile(uid, { username });
  }
  await updateUsername(username);
  return getUserProfile();
}

export async function setUserBio(uid: string, bio: string): Promise<MappedUser | UserProfile | null> {
  if (isSupabaseMode()) {
    return UserSupabaseService.updateProfile(uid, { bio });
  }
  return updateUserBio(bio);
}

export async function setUserProfileImage(uid: string, file: File | null): Promise<MappedUser | UserProfile | null> {
  if (isSupabaseMode()) {
    const reader = new FileReader();
    return new Promise((resolve, reject) => {
      reader.onload = async () => {
        if (!file) {
          const updated = await UserSupabaseService.updateProfile(uid, {
            profileImage: null,
          });
          resolve(updated);
          return;
        }
        const updated = await UserSupabaseService.updateProfile(uid, {
          profileImage: reader.result,
        });
        resolve(updated);
      };
      reader.onerror = () => reject(new Error('Error al leer la imagen'));
      reader.readAsDataURL(file || new Blob());
    });
  }
  return updateProfileImageUtil(file);
}

export async function addUserMoney(uid: string, amount: number): Promise<MappedUser | UserProfile | null> {
  if (isSupabaseMode()) {
    await UserSupabaseService.updateVirtualMoney(uid, amount);
    return UserSupabaseService.getByUserId(uid);
  }
  addVirtualMoney(amount);
  return getUserProfile();
}

export async function spendUserMoney(uid: string, amount: number): Promise<MappedUser | UserProfile | null> {
  if (isSupabaseMode()) {
    const profile = await UserSupabaseService.getByUserId(uid);
    const current = profile?.virtualMoney ?? 0;
    if (current < amount) throw new Error('Monedas insuficientes');
    await UserSupabaseService.updateProfile(uid, {
      virtualMoney: current - amount,
    });
    return UserSupabaseService.getByUserId(uid);
  }
  removeVirtualMoney(amount);
  return getUserProfile();
}
