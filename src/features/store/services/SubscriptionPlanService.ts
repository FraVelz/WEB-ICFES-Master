/**
 * Servicio de planes - Versión local (localStorage)
 * Preparado para futura implementación de backend
 */
const PLAN_KEY = 'icfes_user_plan';

const defaultPlan = {
  planType: 'free',
  planName: 'Plan Gratuito',
  description: 'Acceso limitado a contenidos',
  price: 0,
  status: 'active',
  features: {
    questionsPerDay: 5,
    simulationTests: false,
    advancedAnalytics: false,
    prioritySupport: false,
  },
};

class SubscriptionPlanService {
  async createDefaultPlan(_uid: string) {
    const planData = {
      ...defaultPlan,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem(PLAN_KEY, JSON.stringify(planData));
    return planData;
  }

  async getUserPlan(_uid: string) {
    const stored = localStorage.getItem(PLAN_KEY);
    return stored ? JSON.parse(stored) : defaultPlan;
  }

  async updateUserPlan(_uid: string, planData: Record<string, unknown>) {
    const current = JSON.parse(localStorage.getItem(PLAN_KEY) || '{}');
    const updated = {
      ...current,
      ...planData,
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem(PLAN_KEY, JSON.stringify(updated));
  }

  async updatePlanStatus(_uid: string, status: string) {
    const current = JSON.parse(localStorage.getItem(PLAN_KEY) || '{}');
    current.status = status;
    current.updatedAt = new Date().toISOString();
    localStorage.setItem(PLAN_KEY, JSON.stringify(current));
  }

  async hasActivePlan(uid: string) {
    const plan = await this.getUserPlan(uid);
    return plan?.status === 'active';
  }

  async getPlanFeatures(uid: string) {
    const plan = await this.getUserPlan(uid);
    return plan?.features || defaultPlan.features;
  }
}

export default new SubscriptionPlanService();
