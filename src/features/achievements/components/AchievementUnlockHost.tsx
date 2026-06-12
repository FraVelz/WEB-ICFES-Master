'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  ACHIEVEMENT_UNLOCK_EVENT,
  type AchievementUnlockPayload,
} from '@/services/achievements/achievementUnlockEvents';
import { AchievementUnlockModal } from './AchievementUnlockModal';

export function AchievementUnlockHost() {
  const [queue, setQueue] = useState<AchievementUnlockPayload[]>([]);

  useEffect(() => {
    const onUnlock = (event: Event) => {
      const detail = (event as CustomEvent<AchievementUnlockPayload>).detail;
      if (!detail?.id) return;

      setQueue((previous) => {
        if (previous.some((item) => item.id === detail.id)) return previous;
        return [...previous, detail];
      });
    };

    window.addEventListener(ACHIEVEMENT_UNLOCK_EVENT, onUnlock);
    return () => window.removeEventListener(ACHIEVEMENT_UNLOCK_EVENT, onUnlock);
  }, []);

  const current = queue[0] ?? null;
  const remaining = Math.max(0, queue.length - 1);

  const handleClose = useCallback(() => {
    setQueue((previous) => previous.slice(1));
  }, []);

  return (
    <AchievementUnlockModal
      achievement={current}
      isOpen={Boolean(current)}
      onClose={handleClose}
      queueCount={remaining}
    />
  );
}
