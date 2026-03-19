/**
 * SERVICES INDEX - Exporta todos los servicios de la aplicación
 *
 * USO:
 * import { UserService, ProgressService, GamificationService, ExamService } from '@/services';
 *
 * Ejemplo:
 * const user = await UserService.getUserProfile();
 * const stats = await ProgressService.getUserStats(userId);
 * await GamificationService.addXP(userId, 50, 'pregunta correcta');
 */

export { default as UserService } from '@/features/user/services/UserService';
export { default as ProgressService } from '@/features/progress/services/ProgressService';
export { default as GamificationService } from '@/features/logros/services/GamificationService';
export { default as ExamService } from '@/features/exam/services/ExamService';
export { default as BaseService } from './BaseService';
export { default as SubscriptionPlanService } from '@/features/store/services/SubscriptionPlanService';
export { default as PlanScheduleService } from '@/features/store/services/PlanScheduleService';
export { default as ExamDataService } from '@/features/exam/services/ExamDataService';
export { default as LearningMaterialService } from '@/features/learning/services/LearningMaterialService';

export { default as AchievementService } from '@/features/logros/services/AchievementService';
export { default as TestResultService } from '@/features/exam/services/TestResultService';

// Re-exportar constantes útiles
import GamificationService from '@/features/logros/services/GamificationService';
export const BADGES = GamificationService.BADGES;
export const LEVELS = GamificationService.LEVELS;
