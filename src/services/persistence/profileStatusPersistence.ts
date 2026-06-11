import { getProfileStatusReaction } from '@/features/user/constants/profileStatusReactions';

export const PROFILE_STATUS_CHANGE_EVENT = 'icfes_profile_status_change';

const STORAGE_KEY = 'icfes_profile_status';

export function getProfileStatusId(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { statusId?: string };
    const id = parsed.statusId ?? null;
    return id && getProfileStatusReaction(id) ? id : null;
  } catch {
    return null;
  }
}

export function setProfileStatusId(statusId: string | null): void {
  if (typeof window === 'undefined') return;
  if (!statusId) {
    localStorage.removeItem(STORAGE_KEY);
  } else {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ statusId }));
  }
  window.dispatchEvent(new Event(PROFILE_STATUS_CHANGE_EVENT));
}
