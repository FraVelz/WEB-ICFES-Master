import { AREA_INFO, HOME_AREA_IDS } from '@/shared/constants';
import { STREAK_ACHIEVEMENT_IDS } from './achievementsConstancyMetas';
import { phaseAchievementGroupKey } from './achievementGrouping';
import { phaseAchievementId } from './achievementsPhases';
import type { AchievementCategoryKey } from './achievementCategories';

export type AchievementChainDefinition = {
  id: string;
  title: string;
  icon: string;
  category: AchievementCategoryKey;
  group: string;
  tierIds: readonly string[];
};

const LEAGUE_TIER_IDS = [
  'league_explorador',
  'league_aprendiz',
  'league_competente',
  'league_avanzado',
  'league_experto',
  'league_maestro',
] as const;

const LECTURA_TIER_IDS = ['read_importancia', 'read_informacion', 'read_consejos', 'read_ruta_al_500'] as const;

const PHASE_TIER_KEYS = ['cimentacion', 'relacion', 'maestria', 'simulacro'] as const;

const STATIC_CHAINS: AchievementChainDefinition[] = [
  {
    id: 'estudio_lecciones',
    title: 'Lecciones completadas',
    icon: 'book',
    category: 'estudio',
    group: 'estudio_general',
    tierIds: ['study_1', 'study_2'],
  },
  {
    id: 'rendimiento_practica',
    title: 'Práctica por área',
    icon: 'bolt',
    category: 'rendimiento',
    group: 'rendimiento_practica',
    tierIds: ['practice_1', 'practice_5'],
  },
  {
    id: 'constancia_racha',
    title: 'Racha de estudio',
    icon: 'fire',
    category: 'constancia',
    group: 'constancia_racha',
    tierIds: STREAK_ACHIEVEMENT_IDS,
  },
  {
    id: 'lectura_guias',
    title: 'Apartados de lectura',
    icon: 'book-open',
    category: 'lectura',
    group: 'lectura_guias',
    tierIds: LECTURA_TIER_IDS,
  },
  {
    id: 'ligas_clasificatoria',
    title: 'Ascenso de liga',
    icon: 'crown',
    category: 'ligas',
    group: 'ligas_clasificatoria',
    tierIds: LEAGUE_TIER_IDS,
  },
];

const PHASE_CHAINS: AchievementChainDefinition[] = HOME_AREA_IDS.map((areaId) => ({
  id: `fases_${areaId.replace(/-/g, '_')}`,
  title: `Recorrido — ${AREA_INFO[areaId].name}`,
  icon: AREA_INFO[areaId].icon,
  category: 'fases' as const,
  group: phaseAchievementGroupKey(areaId),
  tierIds: PHASE_TIER_KEYS.map((phaseKey) => phaseAchievementId(phaseKey, areaId)),
}));

export const ACHIEVEMENT_CHAINS: AchievementChainDefinition[] = [...STATIC_CHAINS, ...PHASE_CHAINS];

export const ACHIEVEMENT_CHAIN_TIER_IDS = new Set(ACHIEVEMENT_CHAINS.flatMap((chain) => chain.tierIds));

export type AchievementChainTierMeta = {
  chainId: string;
  chainTitle: string;
  tierLevel: number;
  tierCount: number;
};

export function getAchievementChainMetaForTier(tierId: string): AchievementChainTierMeta | null {
  for (const chain of ACHIEVEMENT_CHAINS) {
    const tierIndex = chain.tierIds.indexOf(tierId);
    if (tierIndex === -1) continue;
    return {
      chainId: chain.id,
      chainTitle: chain.title,
      tierLevel: tierIndex + 1,
      tierCount: chain.tierIds.length,
    };
  }
  return null;
}
