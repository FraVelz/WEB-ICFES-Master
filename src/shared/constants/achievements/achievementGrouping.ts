import { AREA_INFO, HOME_AREA_IDS, type AreaId } from '@/shared/constants/areaInfo';
import { ACHIEVEMENT_CATEGORIES, type AchievementCategoryKey } from './achievementCategories';

export type AchievementDisplayItem = {
  id: string;
  category?: string;
  group?: string;
  status?: string;
  progress?: number;
  target?: number;
  title?: string;
  description?: string;
  icon?: string;
  xpReward?: number;
};

export type AchievementGroupMeta = {
  label: string;
  icon: string;
  order: number;
};

const CATEGORY_ORDER: Record<string, number> = {
  estudio: 1,
  fases: 2,
  rendimiento: 3,
  constancia: 4,
  metas: 5,
  lectura: 6,
  ligas: 7,
  otros: 99,
};

const STATIC_GROUP_META: Record<string, AchievementGroupMeta> = {
  estudio_general: { label: 'Progreso general', icon: 'book', order: 10 },
  rendimiento_practica: { label: 'Práctica por área', icon: 'bolt', order: 10 },
  rendimiento_resultados: { label: 'Resultados destacados', icon: 'brain', order: 20 },
  rendimiento_simulacro: { label: 'Simulacros', icon: 'clipboard-list', order: 30 },
  constancia_racha: { label: 'Rachas de estudio', icon: 'fire', order: 10 },
  constancia_tiempo: { label: 'Tiempo de estudio', icon: 'clock', order: 20 },
  metas_nivel: { label: 'Nivel de cuenta', icon: 'trophy', order: 10 },
  metas_referidos: { label: 'Invita amigos', icon: 'user-plus', order: 20 },
  metas_reportes_soporte: { label: 'Reportes de soporte', icon: 'bug', order: 30 },
  metas_reportes_perfil: { label: 'Reportes de perfil', icon: 'flag', order: 40 },
  lectura_guias: { label: 'Apartados de lectura', icon: 'book-open', order: 10 },
  ligas_clasificatoria: { label: 'Ascensos de liga', icon: 'crown', order: 10 },
  otros: { label: 'Otros', icon: 'star', order: 999 },
};

export function phaseAchievementGroupKey(areaId: AreaId): string {
  return `fases_${areaId.replace(/-/g, '_')}`;
}

for (const [index, areaId] of HOME_AREA_IDS.entries()) {
  STATIC_GROUP_META[phaseAchievementGroupKey(areaId)] = {
    label: AREA_INFO[areaId].name,
    icon: AREA_INFO[areaId].icon,
    order: (index + 1) * 10,
  };
}

export function getAchievementGroupMeta(groupKey: string | undefined): AchievementGroupMeta {
  if (groupKey && STATIC_GROUP_META[groupKey]) return STATIC_GROUP_META[groupKey];
  return STATIC_GROUP_META.otros;
}

export function resolveAchievementGroup(achievement: AchievementDisplayItem): string {
  return achievement.group ?? 'otros';
}

const STATUS_ORDER: Record<string, number> = {
  completed: 0,
  in_progress: 1,
  incomplete: 2,
};

export function sortAchievementsForDisplay(items: AchievementDisplayItem[]): AchievementDisplayItem[] {
  return [...items].sort((a, b) => {
    const statusDiff = (STATUS_ORDER[a.status ?? 'incomplete'] ?? 3) - (STATUS_ORDER[b.status ?? 'incomplete'] ?? 3);
    if (statusDiff !== 0) return statusDiff;
    return (a.title ?? '').localeCompare(b.title ?? '', 'es');
  });
}

export type AchievementGroupBucket = {
  groupKey: string;
  meta: AchievementGroupMeta;
  achievements: AchievementDisplayItem[];
  completedCount: number;
  totalCount: number;
};

function bucketItemsByGroup(items: AchievementDisplayItem[]): AchievementGroupBucket[] {
  const map = new Map<string, AchievementDisplayItem[]>();

  for (const item of items) {
    const key = resolveAchievementGroup(item);
    const list = map.get(key) ?? [];
    list.push(item);
    map.set(key, list);
  }

  return Array.from(map.entries())
    .map(([groupKey, groupItems]) => {
      const achievements = sortAchievementsForDisplay(groupItems);
      return {
        groupKey,
        meta: getAchievementGroupMeta(groupKey),
        achievements,
        completedCount: achievements.filter((achievement) => achievement.status === 'completed').length,
        totalCount: achievements.length,
      };
    })
    .sort((a, b) => a.meta.order - b.meta.order);
}

export type AchievementCategorySection = {
  categoryKey: string;
  label: string;
  icon: string;
  order: number;
  groups: AchievementGroupBucket[];
  completedCount: number;
  totalCount: number;
};

export function organizeAchievementsForDisplay(
  achievements: AchievementDisplayItem[],
  categoryFilter: AchievementCategoryKey | 'all' = 'all'
): AchievementCategorySection[] {
  const filtered =
    categoryFilter === 'all' ? achievements : achievements.filter((item) => item.category === categoryFilter);

  const byCategory = new Map<string, AchievementDisplayItem[]>();
  for (const item of filtered) {
    const categoryKey = item.category ?? 'otros';
    const list = byCategory.get(categoryKey) ?? [];
    list.push(item);
    byCategory.set(categoryKey, list);
  }

  return Array.from(byCategory.entries())
    .map(([categoryKey, items]) => {
      const groups = bucketItemsByGroup(items);
      const categoryMeta = ACHIEVEMENT_CATEGORIES[categoryKey as AchievementCategoryKey];
      return {
        categoryKey,
        label: categoryMeta?.label ?? categoryKey,
        icon: categoryMeta?.icon ?? 'star',
        order: CATEGORY_ORDER[categoryKey] ?? CATEGORY_ORDER.otros,
        groups,
        completedCount: items.filter((item) => item.status === 'completed').length,
        totalCount: items.length,
      };
    })
    .sort((a, b) => a.order - b.order);
}

export function pickAchievementsForProfilePreview(
  sections: AchievementCategorySection[],
  maxItems = 12,
  maxPerGroup = 2
): AchievementDisplayItem[] {
  const picked: AchievementDisplayItem[] = [];

  for (const section of sections) {
    for (const group of section.groups) {
      for (const achievement of group.achievements) {
        if (picked.length >= maxItems) return picked;
        const groupCount = picked.filter((item) => resolveAchievementGroup(item) === group.groupKey).length;
        if (groupCount >= maxPerGroup) continue;
        picked.push(achievement);
      }
    }
  }

  return picked;
}
