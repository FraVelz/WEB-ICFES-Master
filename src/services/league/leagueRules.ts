import { RANKS } from '@/shared/constants/ranks';

export const LEAGUE_SMALL_GROUP_THRESHOLD = 10;

export type LeagueRankId = (typeof RANKS)[keyof typeof RANKS]['id'];

export interface LeaguePromotionRules {
  promoteCount: number;
  demoteCount: number;
}

/** Reglas efectivas de ascenso/descenso según tamaño del grupo. */
export function getEffectiveLeagueRules(
  leagueRankId: string,
  groupSize: number
): LeaguePromotionRules {
  const rank = Object.values(RANKS).find((r) => r.id === leagueRankId) ?? RANKS.NOVATO;
  let promoteCount = rank.promoteCount;
  let demoteCount = rank.demoteCount;

  if (groupSize < LEAGUE_SMALL_GROUP_THRESHOLD) {
    demoteCount = 0;
    promoteCount = Math.min(promoteCount, Math.max(0, Math.floor(groupSize / 2)));
  }

  return { promoteCount, demoteCount };
}

/** Índices (0-based) de jugadores que ascienden en un grupo ordenado por XP. */
export function getPromotionIndices(groupSize: number, promoteCount: number): number[] {
  const count = Math.min(promoteCount, groupSize);
  return Array.from({ length: count }, (_, i) => i);
}

/** Índices (0-based) de jugadores que descienden (excluye promovidos si se solapan). */
export function getDemotionIndices(
  groupSize: number,
  demoteCount: number,
  promotedIndices: number[]
): number[] {
  if (demoteCount <= 0 || groupSize <= demoteCount) {
    return [];
  }

  const promoted = new Set(promotedIndices);
  const indices: number[] = [];
  for (let i = groupSize - 1; i >= 0 && indices.length < demoteCount; i--) {
    if (!promoted.has(i)) {
      indices.push(i);
    }
  }
  return indices;
}
