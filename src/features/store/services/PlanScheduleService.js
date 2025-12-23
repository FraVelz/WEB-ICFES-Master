import { doc, setDoc, updateDoc, query, collection, where, getDocs, Timestamp } from 'firebase/firestore';
import { db } from '@/config/firebase';
import SubscriptionPlanService from './SubscriptionPlanService';

class PlanScheduleService {
  /**
   * Obtiene todos los planes programados (en espera) del usuario
   * @param {string} uid - ID del usuario
   * @returns {Promise<Array>} - Array de planes en espera
   */
  async getScheduledPlans(uid) {
    try {
      const scheduledPlansRef = collection(db, 'scheduledPlans');
      const q = query(scheduledPlansRef, where('userId', '==', uid));
      const snapshot = await getDocs(q);
      
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error al obtener planes programados:', error);
      return [];
    }
  }

  /**
   * Valida si el usuario puede tener otro plan en espera
   * Máximo: 1 plan activo + 1 plan en espera
   * @param {string} uid - ID del usuario
   * @returns {Promise<Object>} - { canSchedule: boolean, reason: string }
   */
  async validatePlanScheduling(uid) {
    try {
      const currentPlan = await SubscriptionPlanService.getUserPlan(uid);
      const scheduledPlans = await this.getScheduledPlans(uid);

      // Si no tiene plan activo, puede comprar directamente
      if (!currentPlan || currentPlan.status !== 'active') {
        return { canSchedule: true, reason: 'No hay plan activo' };
      }

      // Si tiene un plan activo y ya hay un plan en espera, no puede comprar más
      if (scheduledPlans.length > 0) {
        return { 
          canSchedule: false, 
          reason: 'Ya tienes un plan en espera de activación. No puedes tener más de uno.' 
        };
      }

      return { canSchedule: true, reason: 'Puede programar un nuevo plan' };
    } catch (error) {
      console.error('Error al validar programación:', error);
      return { canSchedule: false, reason: 'Error al validar' };
    }
  }

  /**
   * Programa un plan para activarse después del plan actual
   * @param {string} uid - ID del usuario
   * @param {Object} planData - Datos del plan a programar
   * @returns {Promise<void>}
   */
  async schedulePlan(uid, planData) {
    try {
      const currentPlan = await SubscriptionPlanService.getUserPlan(uid);
      
      if (!currentPlan || currentPlan.status !== 'active') {
        throw new Error('No hay plan activo para programar el nuevo plan');
      }

      const scheduledPlanRef = doc(collection(db, 'scheduledPlans'));
      const scheduledPlanData = {
        userId: uid,
        planType: planData.planType,
        planName: planData.planName,
        price: planData.price,
        billingPeriod: planData.billingPeriod,
        features: planData.features || [],
        scheduledFor: currentPlan.nextBillingDate,
        createdAt: Timestamp.now(),
        status: 'pending'
      };

      await setDoc(scheduledPlanRef, scheduledPlanData);
    } catch (error) {
      console.error('Error al programar plan:', error);
      throw error;
    }
  }

  /**
   * Activa un plan programado si es hora
   * @param {string} uid - ID del usuario
   * @returns {Promise<void>}
   */
  async activateScheduledPlan(uid) {
    try {
      const scheduledPlans = await this.getScheduledPlans(uid);
      const now = new Date();

      for (const scheduledPlan of scheduledPlans) {
        const scheduledDate = scheduledPlan.scheduledFor?.toDate?.() || new Date(scheduledPlan.scheduledFor);
        
        if (scheduledDate <= now && scheduledPlan.status === 'pending') {
          // Activar el plan programado
          const planData = {
            planType: scheduledPlan.planType,
            planName: scheduledPlan.planName,
            status: 'active',
            price: scheduledPlan.price,
            billingPeriod: scheduledPlan.billingPeriod,
            features: scheduledPlan.features,
            purchaseDate: new Date(),
            nextBillingDate: new Date(
              now.getTime() + 
              (scheduledPlan.billingPeriod === 'annual' 
                ? 365 * 24 * 60 * 60 * 1000 
                : 30 * 24 * 60 * 60 * 1000)
            )
          };

          await SubscriptionPlanService.updateUserPlan(uid, planData);

          // Marcar como activado
          const scheduledPlanRef = doc(db, 'scheduledPlans', scheduledPlan.id);
          await updateDoc(scheduledPlanRef, { status: 'activated' });
        }
      }
    } catch (error) {
      console.error('Error al activar plan programado:', error);
    }
  }

  /**
   * Cancela un plan programado
   * @param {string} scheduledPlanId - ID del plan programado
   * @returns {Promise<void>}
   */
  async cancelScheduledPlan(scheduledPlanId) {
    try {
      const scheduledPlanRef = doc(db, 'scheduledPlans', scheduledPlanId);
      await updateDoc(scheduledPlanRef, { status: 'cancelled' });
    } catch (error) {
      console.error('Error al cancelar plan programado:', error);
      throw error;
    }
  }
}

export default new PlanScheduleService();
