'use client';

import { REFERRAL_STORAGE_KEY } from './referralConstants';

export function captureReferralCodeFromUrl(): void {
  if (typeof window === 'undefined') return;
  const params = new URLSearchParams(window.location.search);
  const ref = params.get('ref')?.trim();
  if (ref) {
    sessionStorage.setItem(REFERRAL_STORAGE_KEY, ref);
  }
}

export function getStoredReferralCode(): string | null {
  if (typeof window === 'undefined') return null;
  const stored = sessionStorage.getItem(REFERRAL_STORAGE_KEY);
  return stored?.trim() || null;
}

export function clearStoredReferralCode(): void {
  if (typeof window === 'undefined') return;
  sessionStorage.removeItem(REFERRAL_STORAGE_KEY);
}

function normalizeReferralCode(value: string | null | undefined): string | null {
  const trimmed = value?.trim();
  return trimmed ? trimmed.toUpperCase() : null;
}
