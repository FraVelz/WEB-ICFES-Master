'use client';

import { useEffect } from 'react';
import { captureReferralCodeFromUrl } from '@/services/referrals/referralStorage';

/** Guarda ?ref= en sessionStorage al entrar a rutas de auth. */
export function ReferralCapture() {
  useEffect(() => {
    captureReferralCodeFromUrl();
  }, []);

  return null;
}
