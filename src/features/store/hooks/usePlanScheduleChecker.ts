'use client';

import { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { PlanScheduleService } from '@/services';

/** Poll scheduled plan activations on session start (local no-op until backend) */
export const usePlanScheduleChecker = () => {
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    // Run once on mount
    const checkScheduledPlans = async () => {
      try {
        await PlanScheduleService.activateScheduledPlan(user.uid);
      } catch (error) {
        console.error('Error al revisar planes programados:', error);
      }
    };

    checkScheduledPlans();

    // Every 5 minutes
    const interval = setInterval(checkScheduledPlans, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [user]);
};
