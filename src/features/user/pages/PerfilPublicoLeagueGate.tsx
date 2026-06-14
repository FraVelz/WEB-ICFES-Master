'use client';

import type { ReactNode } from 'react';
import { LeagueProvider } from '@/hooks/gamification/LeagueContext';

/** Public profile route lives outside (dashboard) layout — needs its own league provider. */
export function PerfilPublicoLeagueGate({ children }: { children: ReactNode }) {
  return <LeagueProvider>{children}</LeagueProvider>;
}
