'use client';

import { QueryClient } from '@tanstack/react-query';

const STALE_TIME_MS = 3 * 60 * 1000;

export function createAppQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: STALE_TIME_MS,
        refetchOnWindowFocus: false,
        retry: 1,
      },
    },
  });
}
