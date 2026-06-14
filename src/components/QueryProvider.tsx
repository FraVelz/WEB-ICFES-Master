'use client';

import { useState, type ReactNode } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { createAppQueryClient } from '@/services/query/queryClient';

export function QueryProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => createAppQueryClient());
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
