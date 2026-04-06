/**
 * Servicios de la aplicación
 *
 * Persistencia dual (Supabase / localStorage): usar `@/services/persistence`.
 */
export { default as BaseService } from './BaseService';
export { default as SubscriptionPlanService } from '@/features/store/services/SubscriptionPlanService';
export { default as PlanScheduleService } from '@/features/store/services/PlanScheduleService';
export { default as ExamDataService } from '@/features/exam/services/ExamDataService';
export { default as LearningMaterialService } from '@/features/learning/services/LearningMaterialService';

export { default as AchievementService } from '@/features/logros/services/AchievementService';
export { default as TestResultService } from '@/features/exam/services/TestResultService';

export * from './persistence';

export { BADGES, LEVELS } from '@/features/logros/services/gamificationConstants';
