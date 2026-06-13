/**
 * Unified persistence layer (Supabase + client progress cache).
 * Prefer this module in features/UI instead of `@/storage` directly.
 */
export { isSupabaseConfigured } from './supabaseConfigured';
export { clearLocalClientData } from './clearLocalClientData';
export { gamificationPersistence } from './gamificationPersistence';
export {
  loadStreakState,
  recordStreakToday,
  mergeDemoStreakIntoUser,
  getStreakScope,
  STREAK_UPDATED_EVENT,
  type StreakScope,
} from './streakPersistence';
export { mergeDemoIntoUser, hasDemoDataToMigrate } from '@/services/demo/mergeDemoIntoUser';
export { getCoinsBalance, addCoinsBalance, spendCoinsBalance, COINS_CHANGE_EVENT } from './coinsPersistence';
export {
  getShopInventoryState,
  readDemoShopInventorySync,
  addShopInventoryItem,
  setEquippedShopLogo,
  hasShopInventoryItem,
  SHOP_INVENTORY_CHANGE_EVENT,
  type ShopInventoryState,
} from './shopInventoryPersistence';
export { getDoubleXpExpiresAt, activateDoubleXp, DOUBLE_XP_CHANGE_EVENT } from './doubleXpPersistence';
export {
  getStreakShieldCount,
  addStreakShield,
  consumeStreakShield,
  STREAK_SHIELD_CHANGE_EVENT,
} from './streakShieldPersistence';
export {
  getPersonalLogos,
  addPersonalLogo,
  removePersonalLogo,
  canEquipLogo,
  PERSONAL_LOGOS_CHANGE_EVENT,
  type PersonalLogosChangeDetail,
} from './personalLogosPersistence';
export { loadProgressViewState, resetProgressData, type ProgressViewState } from './progressPersistence';
export { getExamById, resetUserExams, getUserExamsList } from './examPersistence';
export {
  loadUserProfile,
  patchUserProfile,
  setUsername,
  setUserBio,
  setUserProfileImage,
  addUserMoney,
  spendUserMoney,
  USER_PROFILE_CHANGE_EVENT,
  emitUserProfileChanged,
  type UserProfileChangeDetail,
} from './userPersistence';
export { getAggregatedUserData } from './userDataBundle';
export {
  getAssessmentScope,
  getAssessmentOptionsFromContext,
  persistLevelAssessment,
  hasCompletedLevelAssessment,
  loadPersistedSkillLevel,
  resolveLevelAssessmentRedirect,
} from './skillLevelPersistence';

export type { UserProfile, UserRank, RankInfo } from '@/features/user/types/userProfile.types';
export { getPerformanceRank } from '@/features/user/utils/performanceRank';

export {
  getProgress,
  getStoredExams,
  getStoredPractices,
  savePractice,
  saveFullExam,
  getCompletedLessons,
  markLessonAsCompleted,
  LESSON_COMPLETED_EVENT,
  clearAllData,
  type ProgressData,
  type AttemptWithQuestions,
} from '@/storage/progressStorage';

export {
  PHASE_SKIP_PASS_PERCENT,
  PHASE_SKIP_UPDATED_EVENT,
  getPhaseSkips,
  isPhaseSkipped,
  getSkippedSectionIdsForArea,
  markPhaseSkipped,
  type PhaseSkipRecord,
} from './phaseSkipPersistence';

export { PROFILE_STATUS_CHANGE_EVENT, getProfileStatusId, setProfileStatusId } from './profileStatusPersistence';

export {
  BLOCK_EXAM_PASS_PERCENT,
  BLOCK_EXAM_UPDATED_EVENT,
  getBlockExamPasses,
  isBlockExamPassed,
  getPassedBlockIdsForArea,
  markBlockExamPassed,
  type BlockExamPassRecord,
} from './blockExamPersistence';

export { formatTimeExtended } from '@/storage/timeFormatter';
