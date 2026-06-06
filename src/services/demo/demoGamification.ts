const DEMO_GAMIFICATION_KEY = 'icfes_demo_gamification';

interface DemoGamificationState {
  totalXP: number;
}

function readState(): DemoGamificationState {
  if (typeof window === 'undefined') return { totalXP: 0 };

  const raw = localStorage.getItem(DEMO_GAMIFICATION_KEY);
  if (!raw) return { totalXP: 0 };

  try {
    const parsed = JSON.parse(raw) as DemoGamificationState;
    return { totalXP: Number(parsed.totalXP) || 0 };
  } catch {
    return { totalXP: 0 };
  }
}

function writeState(state: DemoGamificationState): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(DEMO_GAMIFICATION_KEY, JSON.stringify(state));
}

export function getDemoTotalXP(): number {
  return readState().totalXP;
}

export function addDemoXP(amount: number): number {
  if (amount <= 0) return getDemoTotalXP();
  const next = readState().totalXP + amount;
  writeState({ totalXP: next });
  return next;
}
