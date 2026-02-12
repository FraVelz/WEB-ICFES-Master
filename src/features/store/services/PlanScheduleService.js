/**
 * Servicio de planes programados - Versión local (no-op)
 * Preparado para futura implementación de backend
 */
import SubscriptionPlanService from './SubscriptionPlanService';

class PlanScheduleService {
  async getScheduledPlans(uid) {
    return [];
  }

  async validatePlanScheduling(uid) {
    return { canSchedule: true, reason: 'Puede programar un nuevo plan' };
  }

  async schedulePlan(uid, planData) {
    // No-op en modo local
  }

  async activateScheduledPlan(uid) {
    // No-op en modo local - no hay planes programados
  }

  async cancelScheduledPlan(scheduledPlanId) {
    // No-op en modo local
  }
}

export default new PlanScheduleService();
