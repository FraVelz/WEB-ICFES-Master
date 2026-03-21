/**
 * Servicio de planes programados - Versión local (no-op)
 * Preparado para futura implementación de backend
 */
import SubscriptionPlanService from './SubscriptionPlanService';

class PlanScheduleService {
  async getScheduledPlans(_uid: string) {
    return [];
  }

  async validatePlanScheduling(_uid: string) {
    return { canSchedule: true, reason: 'Puede programar un nuevo plan' };
  }

  async schedulePlan(_uid: string, _planData: unknown) {
    // No-op en modo local
  }

  async activateScheduledPlan(_uid: string) {
    // No-op en modo local - no hay planes programados
  }

  async cancelScheduledPlan(_scheduledPlanId: string) {
    // No-op en modo local
  }
}

export default new PlanScheduleService();
