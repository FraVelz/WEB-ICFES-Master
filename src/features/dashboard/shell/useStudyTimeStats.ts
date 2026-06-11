'use client';

import { useEffect, useState } from 'react';
import { getStudyTimeStats, STUDY_TIME_UPDATED_EVENT, type StudyTimeStats } from '@/services/studyTime';

const EMPTY_STATS: StudyTimeStats = {
  totalMinutes: 0,
  longestSessionMinutes: 0,
  currentSessionMinutes: 0,
};

export function useStudyTimeStats(userId: string | null) {
  const [stats, setStats] = useState<StudyTimeStats>(EMPTY_STATS);

  useEffect(() => {
    if (!userId) {
      setStats(EMPTY_STATS);
      return;
    }

    const refresh = () => setStats(getStudyTimeStats(userId));
    refresh();
    window.addEventListener(STUDY_TIME_UPDATED_EVENT, refresh);
    return () => window.removeEventListener(STUDY_TIME_UPDATED_EVENT, refresh);
  }, [userId]);

  return stats;
}
