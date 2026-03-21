/**
 * Servicio de usuario - Versión local (localStorage)
 */
import {
  getUserProfile,
  updateUserProfile,
  type UserProfile,
} from '@/shared/utils/userProfile';

class UserLocalService {
  async getUserProfile(_uid?: string): Promise<UserProfile> {
    return getUserProfile();
  }

  async createUserProfile(uid: string, data: Record<string, unknown>): Promise<UserProfile> {
    return updateUserProfile({ ...data, id: uid } as unknown as Partial<UserProfile>);
  }

  async updateUserProfile(_uid: string, data: Record<string, unknown>): Promise<UserProfile> {
    return updateUserProfile(data as Partial<UserProfile>);
  }

  async userExists(_uid: string): Promise<boolean> {
    return false;
  }

  async userExistsByEmail(_email: string): Promise<boolean> {
    return false;
  }

  async updateUsername(_uid: string, username: string): Promise<UserProfile> {
    return updateUserProfile({ username });
  }

  async updateUserBio(_uid: string, bio: string): Promise<UserProfile> {
    return updateUserProfile({ bio });
  }

  async updateProfileImage(_uid: string, url: string | null): Promise<UserProfile> {
    return updateUserProfile({ profileImage: url });
  }

  async getUserPreferences(_uid: string): Promise<Record<string, unknown>> {
    return {};
  }

  async updateUserPreferences(_uid: string, _prefs: Record<string, unknown>): Promise<Record<string, unknown>> {
    return {};
  }

  async addVirtualMoney(_uid: string, _amount: number): Promise<Record<string, unknown>> {
    return {};
  }

  async spendVirtualMoney(_uid: string, _amount: number): Promise<Record<string, unknown>> {
    return {};
  }

  async addBadge(_uid: string, _badgeId: string): Promise<unknown[]> {
    return [];
  }
}

export default new UserLocalService();
