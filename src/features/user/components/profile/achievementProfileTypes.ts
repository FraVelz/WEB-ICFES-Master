import {
  sortAchievementsForDisplay,
  type AchievementDisplayItem,
} from '@/shared/constants/achievements/achievementGrouping';

export type ProfileAchievement = AchievementDisplayItem & {
  title: string;
  icon: string;
  status: string;
};

const ACHIEVEMENT_STATUS_ORDER: Record<string, number> = {
  completed: 0,
  in_progress: 1,
  incomplete: 2,
};

function sortAchievementsForProfile(achievements: ProfileAchievement[]): ProfileAchievement[] {
  return sortAchievementsForDisplay(achievements) as ProfileAchievement[];
}

/** En perfil solo se muestran logros con avance o ya desbloqueados. */
function filterProfileVisibleAchievements(achievements: ProfileAchievement[]): ProfileAchievement[] {
  return achievements.filter(
    (achievement) => achievement.status === 'completed' || achievement.status === 'in_progress'
  );
}
