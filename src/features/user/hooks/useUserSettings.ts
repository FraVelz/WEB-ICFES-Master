'use client';

import { useUserSettingsState } from './useUserSettingsState';
import { useUserSettingsHandlers } from './useUserSettingsHandlers';

export function useUserSettings() {
  const state = useUserSettingsState();
  const handlers = useUserSettingsHandlers(state);

  return {
    ...state,
    ...handlers,
  };
}

export type UserSettingsContextValue = ReturnType<typeof useUserSettings>;
