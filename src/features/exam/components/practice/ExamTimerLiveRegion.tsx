'use client';

import { useEffect, useState } from 'react';
import {
  formatTimerAnnouncement,
  shouldAnnounceTimerRemaining,
} from '@/features/exam/utils/practiceExamKeyboard';

type ExamTimerLiveRegionProps = {
  timeRemaining: number | null;
  showTimer?: boolean;
};

/**
 * Polite aria-live region for exam timer — announces about every 5 minutes,
 * not on every one-second tick (avoids SR spam).
 */
export function ExamTimerLiveRegion({ timeRemaining, showTimer }: ExamTimerLiveRegionProps) {
  const [announcement, setAnnouncement] = useState('');
  const [lastAnnouncedAt, setLastAnnouncedAt] = useState<number | null>(null);

  useEffect(() => {
    if (!showTimer || timeRemaining == null) {
      setAnnouncement('');
      setLastAnnouncedAt(null);
      return;
    }

    if (!shouldAnnounceTimerRemaining(timeRemaining, lastAnnouncedAt)) return;

    setAnnouncement(formatTimerAnnouncement(timeRemaining));
    setLastAnnouncedAt(timeRemaining);
  }, [showTimer, timeRemaining, lastAnnouncedAt]);

  if (!showTimer) return null;

  return (
    <div className="sr-only" aria-live="polite" aria-atomic="true">
      {announcement}
    </div>
  );
}
