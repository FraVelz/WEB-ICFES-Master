import { configureStore } from '@reduxjs/toolkit';

import { uiSessionSyncMiddleware } from '@/store/middleware/uiSessionSyncMiddleware';
import { uiSessionSlice } from '@/store/slices/uiSessionSlice';

/**
 * User authentication and profile from Supabase (or mock) remain in AuthContext — not duplicated here.
 *
 * Redux holds the `uiSession` slice only: demo mode, pricing checkout resume, and related UI flags.
 * Server-backed data and Supabase subscriptions should stay outside Redux unless you add RTK Query later.
 *
 * Client-only progress (`progressStorage`, `userProfile` helpers) can stay as-is; introduce a `progress`
 * slice later only if multiple distant components must react to the same local updates without prop drilling.
 */
export const makeStore = () =>
  configureStore({
    reducer: {
      [uiSessionSlice.name]: uiSessionSlice.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().prepend(uiSessionSyncMiddleware.middleware),
  });

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
