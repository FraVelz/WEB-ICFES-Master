import { COMPETENCY_PHASES } from '@/features/learning/data/competencyPhases';
import { AREA_INFO, HOME_AREA_IDS, type AreaId } from '@/shared/constants/areaInfo';
import { phaseAchievementGroupKey } from './achievementGrouping';

function phaseAchievementAreaSuffix(areaId: AreaId): string {
  return areaId.replace(/-/g, '_');
}

export function phaseAchievementId(phaseKey: string, areaId: AreaId): string {
  return `phase_${phaseKey}_${phaseAchievementAreaSuffix(areaId)}`;
}

const PHASE_ICONS: Record<string, string> = {
  cimentacion: 'book-open',
  relacion: 'chart-line',
  maestria: 'lightbulb',
  simulacro: 'clipboard-list',
};

export const ACHIEVEMENTS_PHASES = HOME_AREA_IDS.flatMap((areaId) => {
  const areaName = AREA_INFO[areaId].name;

  const areaGroup = phaseAchievementGroupKey(areaId);

  const learningPhases = COMPETENCY_PHASES.map((phase) => ({
    id: phaseAchievementId(phase.id, areaId),
    category: 'fases' as const,
    group: areaGroup,
    title: `${phase.title.replace('Fase de ', '')} — ${areaName}`,
    description: `Completa la ${phase.title.toLowerCase()} en ${areaName} (lecciones o simulacro de la fase).`,
    icon: PHASE_ICONS[phase.id] ?? 'book',
    target: 1,
    xpReward: 100,
    coinsReward: 50,
  }));

  const simulacroPhase = {
    id: phaseAchievementId('simulacro', areaId),
    category: 'fases' as const,
    group: areaGroup,
    title: `Simulacro general — ${areaName}`,
    description: `Completa un simulacro general de ${areaName} (Fase 4 del recorrido).`,
    icon: PHASE_ICONS.simulacro,
    target: 1,
    xpReward: 120,
    coinsReward: 60,
  };

  return [...learningPhases, simulacroPhase];
});
