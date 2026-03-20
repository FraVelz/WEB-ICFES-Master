/**
 * Servicio de usuario - Versión local (localStorage)
 */
import { getUserProfile, updateUserProfile } from '@/shared/utils/userProfile';

class UserLocalService {
  async getUserProfile(uid) {
    return getUserProfile();
  }

  async createUserProfile(uid, data) {
    updateUserProfile({ ...data, id: uid });
  }

  async updateUserProfile(uid, data) {
    return updateUserProfile(data);
  }

  async userExists(uid) {
    return false;
  }
  async userExistsByEmail(email) {
    return false;
  }
  async updateUsername(uid, username) {
    return updateUserProfile({ username });
  }
  async updateUserBio(uid, bio) {
    return updateUserProfile({ bio });
  }
  async updateProfileImage(uid, url) {
    return updateUserProfile({ profileImage: url });
  }
  async getUserPreferences(uid) {
    return {};
  }
  async updateUserPreferences(uid, prefs) {
    return {};
  }
  async addVirtualMoney(uid, amount) {
    return {};
  }
  async spendVirtualMoney(uid, amount) {
    return {};
  }
  async addBadge(uid, badgeId) {
    return [];
  }
}

export default new UserLocalService();
