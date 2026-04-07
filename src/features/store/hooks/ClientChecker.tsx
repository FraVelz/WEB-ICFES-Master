'use client';

import { usePlanScheduleChecker } from '@/features/store/hooks/usePlanScheduleChecker';

export function ClientChecker() {
  usePlanScheduleChecker();
  return null;
}
