import type { RankInfo, UserRank } from '@/features/user/types/userProfile.types';

const RANK_SYSTEM: Record<number, RankInfo> = {
  0: { name: 'Novato', icon: 'user', color: 'from-gray-400 to-gray-600', minScore: 0 },
  1: { name: 'Aprendiz', icon: 'book-open', color: 'from-blue-400 to-blue-600', minScore: 40 },
  2: { name: 'Estudiante', icon: 'book', color: 'from-app-accent to-app-accent-strong', minScore: 55 },
  3: { name: 'Profesional', icon: 'award', color: 'from-green-400 to-green-600', minScore: 70 },
  4: { name: 'Experto', icon: 'graduation-cap', color: 'from-purple-400 to-purple-600', minScore: 80 },
  5: { name: 'Maestro', icon: 'crown', color: 'from-yellow-400 to-yellow-600', minScore: 90 },
};

/** Rank tier from overall performance percentage in local progress. */
export function getPerformanceRank(): UserRank {
  if (typeof window === 'undefined') {
    return { ...RANK_SYSTEM[0], percentage: 0, nextRankPercentage: RANK_SYSTEM[1].minScore };
  }

  try {
    const progress = JSON.parse(localStorage.getItem('icfes_progress') ?? 'null') as { percentage?: number } | null;
    const percentage = progress?.percentage ?? 0;

    let currentRank = RANK_SYSTEM[0];
    let rankIndex = 0;
    for (let i = 5; i >= 0; i--) {
      if (percentage >= RANK_SYSTEM[i].minScore) {
        currentRank = RANK_SYSTEM[i];
        rankIndex = i;
        break;
      }
    }

    return {
      ...currentRank,
      percentage,
      nextRankPercentage: rankIndex < 5 ? RANK_SYSTEM[rankIndex + 1].minScore : null,
    };
  } catch {
    return { ...RANK_SYSTEM[0], percentage: 0, nextRankPercentage: RANK_SYSTEM[1].minScore };
  }
}
