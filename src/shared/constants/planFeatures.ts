/** Keys duplicated at row level — keep only inside table columns, not in content JSONB. */
export const LEARNING_CONTENT_STRIP_KEYS = [
  'id',
  'area',
  'published',
  'order',
  'order_index',
  'updatedAt',
  'updated_at',
  'created_at',
] as const;

export function sanitizeLearningContentJson(content: Record<string, unknown>): Record<string, unknown> {
  const next = { ...content };
  for (const key of LEARNING_CONTENT_STRIP_KEYS) {
    delete next[key];
  }
  return next;
}

export const FREE_PLAN_FEATURES = {
  questionsPerDay: 5,
  simulationTests: false,
  advancedAnalytics: false,
  prioritySupport: false,
} as const;

export const PREMIUM_PLAN_FEATURES = {
  questionsPerDay: -1,
  simulationTests: true,
  advancedAnalytics: true,
  prioritySupport: true,
} as const;

export function normalizePlanFeatures(
  features: unknown,
  planType: string | null | undefined
): Record<string, unknown> {
  const type = planType ?? 'free';
  const base =
    type === 'premium' || type === 'basic'
      ? { ...PREMIUM_PLAN_FEATURES }
      : { ...FREE_PLAN_FEATURES };

  if (features && typeof features === 'object' && !Array.isArray(features)) {
    return { ...base, ...(features as Record<string, unknown>) };
  }

  if (Array.isArray(features)) {
    return {
      ...base,
      featureList: features,
    };
  }

  return { ...base };
}
