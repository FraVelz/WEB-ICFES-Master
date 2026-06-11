'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  getProfileStatusId,
  PROFILE_STATUS_CHANGE_EVENT,
  setProfileStatusId,
} from '@/services/persistence/profileStatusPersistence';
import { getProfileStatusReaction } from '@/features/user/constants/profileStatusReactions';

export function useProfileStatus() {
  const [statusId, setStatusIdState] = useState<string | null>(null);

  const sync = useCallback(() => {
    setStatusIdState(getProfileStatusId());
  }, []);

  useEffect(() => {
    sync();
    const onChange = () => sync();
    window.addEventListener(PROFILE_STATUS_CHANGE_EVENT, onChange);
    return () => window.removeEventListener(PROFILE_STATUS_CHANGE_EVENT, onChange);
  }, [sync]);

  const setStatus = useCallback((id: string | null) => {
    setProfileStatusId(id);
    setStatusIdState(id);
  }, []);

  const clearStatus = useCallback(() => {
    setProfileStatusId(null);
    setStatusIdState(null);
  }, []);

  return {
    statusId,
    statusReaction: getProfileStatusReaction(statusId),
    setStatus,
    clearStatus,
  };
}
