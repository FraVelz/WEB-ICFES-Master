'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/features/auth/context/AuthContext';
import { useUiSessionStore } from '@/store/uiSessionStore';
import {
  finalizeStudyTimeSession,
  isStudyPathname,
  processStudyTimeActivity,
  resolveStudyTimeUserId,
} from '@/services/studyTime';

const TICK_MS = 30_000;

export function StudyTimeTracker() {
  const pathname = usePathname();
  const { user } = useAuth();
  const demoMode = useUiSessionStore((state) => state.demoMode);
  const isStudyRoute = isStudyPathname(pathname);

  useEffect(() => {
    const userId = resolveStudyTimeUserId(user?.uid, demoMode);

    if (!isStudyRoute || !userId) {
      if (userId) void finalizeStudyTimeSession(userId);
      return;
    }

    const onActivity = () => {
      void processStudyTimeActivity(userId);
    };

    const events: Array<keyof WindowEventMap> = ['mousemove', 'keydown', 'scroll', 'touchstart', 'click'];
    for (const eventName of events) {
      window.addEventListener(eventName, onActivity, { passive: true });
    }

    const tickId = window.setInterval(onActivity, TICK_MS);

    const onVisibilityChange = () => {
      if (document.hidden) {
        void finalizeStudyTimeSession(userId);
        return;
      }
      void processStudyTimeActivity(userId);
    };

    document.addEventListener('visibilitychange', onVisibilityChange);
    void processStudyTimeActivity(userId);

    return () => {
      for (const eventName of events) {
        window.removeEventListener(eventName, onActivity);
      }
      window.clearInterval(tickId);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      void finalizeStudyTimeSession(userId);
    };
  }, [demoMode, isStudyRoute, pathname, user?.uid]);

  return null;
}
