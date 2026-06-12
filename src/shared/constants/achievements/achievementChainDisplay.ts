import { ACHIEVEMENT_CATEGORIES, type AchievementCategoryKey } from './achievementCategories';
import { ACHIEVEMENT_CHAINS, ACHIEVEMENT_CHAIN_TIER_IDS } from './achievementChains';

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

export type AchievementChainCategorySection = {
  categoryKey: string;
  label: string;
  icon: string;
  order: number;
  items: AchievementChainDisplayItem[];
  completedCount: number;
  totalCount: number;
};

export type AchievementChainDisplayItem = {
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
  chainId: string;
  chainTitle: string;
  tierLevel: number;
  tierCount: number;
};

type AchievementLike = {
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

export type AchievementChainDisplayMode = 'logros' | 'profile';

export type AchievementChainSummary = {
  /** Escalones desbloqueados en backend (todos los tiers). */
  completedTiers: number;
  totalTiers: number;
  /** Metas visibles (un escalón activo por cadena). */
  completedChains: number;
  totalChains: number;
  inProgressChains: number;
};

function toChainItem(
  achievement: AchievementLike,
  chain: (typeof ACHIEVEMENT_CHAINS)[number],
  tierLevel: number
): AchievementChainDisplayItem {
  return {
    ...achievement,
    chainId: chain.id,
    chainTitle: chain.title,
    tierLevel,
    tierCount: chain.tierIds.length,
  };
}

function shouldIncludeInProfile(achievement: AchievementLike): boolean {
  return achievement.status === 'completed' || achievement.status === 'in_progress';
}

/**
 * Muestra un solo escalón activo por cadena (estilo Duolingo).
 * Al completar un nivel, la UI pasa al siguiente más difícil.
 */
export function resolveAchievementChainViews(
  achievements: AchievementLike[],
  mode: AchievementChainDisplayMode = 'logros'
): AchievementChainDisplayItem[] {
  const byId = new Map(achievements.map((item) => [item.id, item]));
  const views: AchievementChainDisplayItem[] = [];

  for (const chain of ACHIEVEMENT_CHAINS) {
    const tiers = chain.tierIds
      .map((id) => byId.get(id))
      .filter((item): item is AchievementLike => Boolean(item));

    if (tiers.length === 0) continue;

    const activeIndex = tiers.findIndex((tier) => tier.status !== 'completed');
    const activeTier =
      activeIndex === -1 ? tiers[tiers.length - 1] : tiers[activeIndex];
    const tierLevel = activeIndex === -1 ? tiers.length : activeIndex + 1;

    if (mode === 'profile' && !shouldIncludeInProfile(activeTier)) continue;

    views.push(toChainItem(activeTier, chain, tierLevel));
  }

  for (const achievement of achievements) {
    if (ACHIEVEMENT_CHAIN_TIER_IDS.has(achievement.id)) continue;
    if (mode === 'profile' && !shouldIncludeInProfile(achievement)) continue;

    views.push({
      ...achievement,
      chainId: achievement.id,
      chainTitle: achievement.title ?? '',
      tierLevel: 1,
      tierCount: 1,
    });
  }

  return views;
}

/** Resumen alineado con la UI de cadenas (metas visibles + tiers reales). */
export function getAchievementChainSummary(achievements: AchievementLike[]): AchievementChainSummary {
  const chainViews = resolveAchievementChainViews(achievements, 'logros');

  return {
    completedTiers: achievements.filter((item) => item.status === 'completed').length,
    totalTiers: achievements.length,
    completedChains: chainViews.filter((item) => item.status === 'completed').length,
    totalChains: chainViews.length,
    inProgressChains: chainViews.filter((item) => item.status === 'in_progress').length,
  };
}

export function organizeChainViewsForDisplay(
  views: AchievementChainDisplayItem[],
  categoryFilter: AchievementCategoryKey | 'all' = 'all'
): AchievementChainCategorySection[] {
  const filtered =
    categoryFilter === 'all' ? views : views.filter((item) => item.category === categoryFilter);

  const byCategory = new Map<string, AchievementChainDisplayItem[]>();
  for (const item of filtered) {
    const categoryKey = item.category ?? 'otros';
    const list = byCategory.get(categoryKey) ?? [];
    list.push(item);
    byCategory.set(categoryKey, list);
  }

  return Array.from(byCategory.entries())
    .map(([categoryKey, items]) => {
      const categoryMeta = ACHIEVEMENT_CATEGORIES[categoryKey as AchievementCategoryKey];
      return {
        categoryKey,
        label: categoryMeta?.label ?? categoryKey,
        icon: categoryMeta?.icon ?? 'star',
        order: CATEGORY_ORDER[categoryKey] ?? CATEGORY_ORDER.otros,
        items,
        completedCount: items.filter((item) => item.status === 'completed').length,
        totalCount: items.length,
      };
    })
    .sort((a, b) => a.order - b.order);
}
