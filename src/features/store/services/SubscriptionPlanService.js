import { doc, setDoc, getDoc, updateDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/config/firebase';

class SubscriptionPlanService {
  /**
   * Crea un plan de suscripción por defecto (gratuito) para un usuario
   * @param {string} uid - ID del usuario
   * @returns {Promise<Object>} - Datos del plan creado
   */
  async createDefaultPlan(uid) {
    try {
      const planData = {
        planType: 'free',
        planName: 'Plan Gratuito',
        description: 'Acceso limitado a contenidos',
        price: 0,
        status: 'active',
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        features: {
          questionsPerDay: 5,
          simulationTests: false,
          advancedAnalytics: false,
          prioritySupport: false
        }
      };

      const userPlanRef = doc(db, 'userPlans', uid);
      await setDoc(userPlanRef, planData);
      
      return planData;
    } catch (error) {
      console.error('Error al crear plan predeterminado:', error);
      throw error;
    }
  }

  /**
   * Obtiene el plan de suscripción del usuario
   * @param {string} uid - ID del usuario
   * @returns {Promise<Object|null>} - Datos del plan o null
   */
  async getUserPlan(uid) {
    try {
      const userPlanRef = doc(db, 'userPlans', uid);
      const planDoc = await getDoc(userPlanRef);
      
      if (planDoc.exists()) {
        return { id: planDoc.id, ...planDoc.data() };
      }
      
      return null;
    } catch (error) {
      console.error('Error al obtener plan del usuario:', error);
      throw error;
    }
  }

  /**
   * Actualiza el plan del usuario
   * @param {string} uid - ID del usuario
   * @param {Object} planData - Datos del nuevo plan
   * @returns {Promise<void>}
   */
  async updateUserPlan(uid, planData) {
    try {
      const userPlanRef = doc(db, 'userPlans', uid);
      const updateData = {
        ...planData,
        updatedAt: Timestamp.now()
      };
      
      await updateDoc(userPlanRef, updateData);
    } catch (error) {
      console.error('Error al actualizar plan del usuario:', error);
      throw error;
    }
  }

  /**
   * Actualiza el estado del plan
   * @param {string} uid - ID del usuario
   * @param {string} status - Nuevo estado (active, expired, suspended)
   * @returns {Promise<void>}
   */
  async updatePlanStatus(uid, status) {
    try {
      const userPlanRef = doc(db, 'userPlans', uid);
      await updateDoc(userPlanRef, {
        status,
        updatedAt: Timestamp.now()
      });
    } catch (error) {
      console.error('Error al actualizar estado del plan:', error);
      throw error;
    }
  }

  /**
   * Verifica si el usuario tiene un plan activo
   * @param {string} uid - ID del usuario
   * @returns {Promise<boolean>}
   */
  async hasActivePlan(uid) {
    try {
      const plan = await this.getUserPlan(uid);
      return plan && plan.status === 'active';
    } catch (error) {
      console.error('Error al verificar plan activo:', error);
      return false;
    }
  }

  /**
   * Obtiene las características disponibles del plan
   * @param {string} uid - ID del usuario
   * @returns {Promise<Object|null>}
   */
  async getPlanFeatures(uid) {
    try {
      const plan = await this.getUserPlan(uid);
      return plan ? plan.features : null;
    } catch (error) {
      console.error('Error al obtener características del plan:', error);
      return null;
    }
  }
}

export default new SubscriptionPlanService();
