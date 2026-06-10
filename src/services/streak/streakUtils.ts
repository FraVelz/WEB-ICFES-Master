import type { StreakState } from './streakTypes';

export function getLocalDateString(date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function normalizeStreakDates(dates: unknown): string[] {
  if (!Array.isArray(dates)) return [];
  return [...new Set(dates.filter((d): d is string => typeof d === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(d)))].sort();
}

export function calculateCurrentStreak(dates: string[]): number {
  const sorted = normalizeStreakDates(dates).sort((a, b) => b.localeCompare(a));
  if (sorted.length === 0) return 0;

  const today = getLocalDateString();
  const yesterday = getLocalDateString(new Date(Date.now() - 86400000));
  if (!sorted.includes(today) && !sorted.includes(yesterday)) return 0;

  let count = 0;
  const anchor = sorted.includes(today) ? today : yesterday;
  let d = new Date(`${anchor}T12:00:00`);
  while (sorted.includes(getLocalDateString(d))) {
    count++;
    d.setDate(d.getDate() - 1);
  }
  return count;
}

/** Longest run of consecutive calendar days in the date set. */
export function calculateLongestStreak(dates: string[]): number {
  const unique = normalizeStreakDates(dates);
  if (unique.length === 0) return 0;

  const sortedAsc = [...unique].sort((a, b) => a.localeCompare(b));
  let max = 1;
  let run = 1;

  for (let i = 1; i < sortedAsc.length; i++) {
    const prev = new Date(sortedAsc[i - 1] + 'T12:00:00');
    const curr = new Date(sortedAsc[i] + 'T12:00:00');
    const expected = new Date(prev);
    expected.setDate(expected.getDate() + 1);
    if (getLocalDateString(expected) === getLocalDateString(curr)) {
      run++;
      max = Math.max(max, run);
    } else {
      run = 1;
    }
  }

  return max;
}

export function mergeStreakStates(...states: StreakState[]): StreakState {
  const allDates = normalizeStreakDates(states.flatMap((s) => s.dates));
  const longestFromDates = calculateLongestStreak(allDates);
  const longestStreak = Math.max(longestFromDates, ...states.map((s) => s.longestStreak ?? 0));
  return { dates: allDates, longestStreak };
}

export function withUpdatedLongest(state: StreakState): StreakState {
  const dates = normalizeStreakDates(state.dates);
  const fromDates = calculateLongestStreak(dates);
  return {
    dates,
    longestStreak: Math.max(state.longestStreak ?? 0, fromDates, calculateCurrentStreak(dates)),
  };
}

export function parseStoredStreak(raw: string | null): StreakState {
  if (!raw) return { dates: [], longestStreak: 0 };
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (Array.isArray(parsed)) {
      return withUpdatedLongest({ dates: normalizeStreakDates(parsed), longestStreak: 0 });
    }
    if (parsed && typeof parsed === 'object') {
      const obj = parsed as { dates?: unknown; longestStreak?: unknown };
      return withUpdatedLongest({
        dates: normalizeStreakDates(obj.dates),
        longestStreak: typeof obj.longestStreak === 'number' ? obj.longestStreak : 0,
      });
    }
  } catch {
    return { dates: [], longestStreak: 0 };
  }
  return { dates: [], longestStreak: 0 };
}

export function serializeStreakState(state: StreakState): string {
  return JSON.stringify(withUpdatedLongest(state));
}

/** Derive YYYY-MM-DD dates from exam/practice attempt ISO strings. */
/** Día perdido que un protector puede rellenar (solo un día por protector). */
export function findMissedStreakDayToProtect(dates: string[]): string | null {
  if (calculateCurrentStreak(dates) > 0) return null;

  const today = getLocalDateString();
  const yesterday = getLocalDateString(new Date(Date.now() - 86400000));
  const normalized = normalizeStreakDates(dates);

  if (normalized.includes(today) || normalized.includes(yesterday)) return null;
  if (normalized.length === 0) return null;

  const lastDate = [...normalized].sort((a, b) => b.localeCompare(a))[0];
  const nextDay = new Date(`${lastDate}T12:00:00`);
  nextDay.setDate(nextDay.getDate() + 1);
  const missedDay = getLocalDateString(nextDay);

  if (missedDay >= today) return null;
  if (normalized.includes(missedDay)) return null;

  return missedDay;
}

export function datesFromAttemptIsoStrings(isoDates: (string | undefined)[]): string[] {
  const out: string[] = [];
  for (const iso of isoDates) {
    if (!iso) continue;
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) continue;
    out.push(getLocalDateString(d));
  }
  return normalizeStreakDates(out);
}
