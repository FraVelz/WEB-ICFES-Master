import { useState, useEffect } from 'react';
import { getStudyTimeStats, STUDY_TIME_UPDATED_EVENT } from '@/services/studyTime';

export function useUserProfileStudyTime(uid: string | undefined) {
  const [studyTimeMinutes, setStudyTimeMinutes] = useState(0);

  useEffect(() => {
    if (!uid) {
      setStudyTimeMinutes(0);
      return;
    }

    const refreshStudyTime = () => {
      const localMinutes = getStudyTimeStats(uid).totalMinutes;
      setStudyTimeMinutes(localMinutes);
    };

    refreshStudyTime();
    window.addEventListener(STUDY_TIME_UPDATED_EVENT, refreshStudyTime);
    return () => window.removeEventListener(STUDY_TIME_UPDATED_EVENT, refreshStudyTime);
  }, [uid]);

  return studyTimeMinutes;
}
