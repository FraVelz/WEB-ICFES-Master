'use client';

import { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { PlanScheduleService } from '@/services';

/**
 * Hook para revisar y activar planes programados automáticamente
 * Se ejecuta cuando el usuario entra a la web y periódicamente después
 */
export const usePlanScheduleChecker = () => {
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    // Revisar planes programados inmediatamente
    const checkScheduledPlans = async () => {
      try {
        await PlanScheduleService.activateScheduledPlan(user.uid);
      } catch (error) {
        console.error('Error al revisar planes programados:', error);
      }
    };

    // Ejecutar inmediatamente
    checkScheduledPlans();

    // Revisar cada 5 minutos (300000 ms)
    const interval = setInterval(checkScheduledPlans, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [user]);
};
