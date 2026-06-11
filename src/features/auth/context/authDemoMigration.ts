import { useCallback } from 'react';
import { useUiSessionStore } from '@/store/uiSessionStore';
import { mergeDemoIntoUser } from '@/services/persistence';
import { setActiveStreakUserId, STREAK_UPDATED_EVENT } from '@/services/streak';

export function useAuthDemoMigration() {
  const clearDemoMode = useCallback(() => {
    useUiSessionStore.getState().setDemoMode(false);
  }, []);

  const migrateDemoOnAuth = useCallback(async (userId: string) => {
    try {
      await mergeDemoIntoUser(userId);
      setActiveStreakUserId(userId);
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent(STREAK_UPDATED_EVENT));
      }
    } catch (err) {
      console.warn('No se pudo migrar el progreso del demo:', err);
    }
  }, []);

  return { clearDemoMode, migrateDemoOnAuth };
}
