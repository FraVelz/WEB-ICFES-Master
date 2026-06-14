import { useState, useEffect } from 'react';
import { isDemoUserId } from '@/services/demo/demoCoins';
import GamificationSupabaseService from '@/services/supabase/GamificationSupabaseService';
import { getStudyTimeStats, readStudyTimeRemoteMeta, STUDY_TIME_UPDATED_EVENT } from '@/services/studyTime';

async function resolveStudyTimeMinutes(userId: string): Promise<number> {
  const localMinutes = getStudyTimeStats(userId).totalMinutes;

  if (isDemoUserId(userId)) {
    return localMinutes;
  }

  try {
    const meta = await GamificationSupabaseService.getAchievementsMetaByUserId(userId);
    const remoteMinutes = readStudyTimeRemoteMeta(meta?.achievements).totalMinutes;
    return Math.max(localMinutes, remoteMinutes);
  } catch {
    return localMinutes;
  }
}

export function useUserProfileStudyTime(uid: string | undefined) {
  const [studyTimeMinutes, setStudyTimeMinutes] = useState(0);

  useEffect(() => {
    if (!uid) {
      setStudyTimeMinutes(0);
      return;
    }

    let cancelled = false;

    const refreshStudyTime = () => {
      void resolveStudyTimeMinutes(uid).then((minutes) => {
        if (!cancelled) setStudyTimeMinutes(minutes);
      });
    };

    refreshStudyTime();
    window.addEventListener(STUDY_TIME_UPDATED_EVENT, refreshStudyTime);
    return () => {
      cancelled = true;
      window.removeEventListener(STUDY_TIME_UPDATED_EVENT, refreshStudyTime);
    };
  }, [uid]);

  return studyTimeMinutes;
}
