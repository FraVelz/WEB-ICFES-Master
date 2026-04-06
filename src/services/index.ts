/**
 * Application services barrel
 *
 * Dual persistence (Supabase / localStorage): prefer `@/services/persistence` helpers.
 */
export { default as SubscriptionPlanService } from '@/features/store/services/SubscriptionPlanService';
export { default as PlanScheduleService } from '@/features/store/services/PlanScheduleService';

export * from './persistence';

export { BADGES, LEVELS } from '@/features/logros/services/gamificationConstants';
