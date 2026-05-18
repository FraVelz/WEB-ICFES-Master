/**
 * Scheduled plan changes — local no-op stub
 * Replace with real scheduling when backend exists
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
    // No-op in local mode
  }

  async activateScheduledPlan(_uid: string) {
    // No-op in local mode — no scheduled rows
  }

  async cancelScheduledPlan(_scheduledPlanId: string) {
    // No-op in local mode
  }
}

export default new PlanScheduleService();
