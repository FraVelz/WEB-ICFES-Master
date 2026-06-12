/**
 * GamificationSupabaseService - Gestión de gamificación en Supabase
 */
import * as boost from './gamification/gamificationBoostMethods';
import * as economy from './gamification/gamificationEconomyMethods';
import * as logos from './gamification/gamificationPersonalLogoMethods';
import * as profile from './gamification/gamificationProfileMethods';
import * as shop from './gamification/gamificationShopMethods';
import * as streak from './gamification/gamificationStreakMethods';

export type { GamificationProfile, ShopInventoryState } from './gamification/gamificationTypes';

const GamificationSupabaseService = {
  getByUserId: profile.getByUserId,
  getAchievementsMetaByUserId: profile.getAchievementsMetaByUserId,
  getEconomyByUserId: profile.getEconomyByUserId,
  getStreakByUserId: profile.getStreakByUserId,
  getOrCreate: profile.getOrCreate,
  addXP: economy.addXP,
  addCoins: economy.addCoins,
  spendCoins: economy.spendCoins,
  getStreak: streak.getStreak,
  updateStreak: streak.updateStreak,
  updateAchievements: streak.updateAchievements,
  getShopInventory: shop.getShopInventory,
  saveShopInventory: shop.saveShopInventory,
  addShopItem: shop.addShopItem,
  setEquippedLogo: shop.setEquippedLogo,
  getPersonalLogos: logos.getPersonalLogos,
  savePersonalLogos: logos.savePersonalLogos,
  addPersonalLogo: logos.addPersonalLogo,
  removePersonalLogo: logos.removePersonalLogo,
  setStreakShieldCount: boost.setStreakShieldCount,
  activateDoubleXp: boost.activateDoubleXp,
};

export default GamificationSupabaseService;
