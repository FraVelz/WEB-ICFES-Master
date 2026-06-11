'use client';

import type { useUserSettingsState } from './useUserSettingsState';
import { useUserSettingsProfileHandlers } from './useUserSettingsProfileHandlers';
import { useUserSettingsAccountHandlers } from './useUserSettingsAccountHandlers';

type SettingsState = ReturnType<typeof useUserSettingsState>;

export function useUserSettingsHandlers(state: SettingsState) {
  const profileHandlers = useUserSettingsProfileHandlers(state);
  const accountHandlers = useUserSettingsAccountHandlers(state);

  return {
    ...profileHandlers,
    ...accountHandlers,
  };
}
