/**
 * Pure keyboard mapping for the practice runner (star mode).
 * 1–4 / A–D select options; N next; P previous; F toggle flag/mark.
 */
export type PracticeKeyboardAction =
  | { type: 'selectOption'; optionIndex: number }
  | { type: 'next' }
  | { type: 'prev' }
  | { type: 'toggleFlag' };

const DIGIT_TO_INDEX: Record<string, number> = {
  Digit1: 0,
  Digit2: 1,
  Digit3: 2,
  Digit4: 3,
  Numpad1: 0,
  Numpad2: 1,
  Numpad3: 2,
  Numpad4: 3,
};

const LETTER_TO_INDEX: Record<string, number> = {
  KeyA: 0,
  KeyB: 1,
  KeyC: 2,
  KeyD: 3,
};

export function parsePracticeExamKey(event: {
  code: string;
  key: string;
  metaKey?: boolean;
  ctrlKey?: boolean;
  altKey?: boolean;
}): PracticeKeyboardAction | null {
  if (event.metaKey || event.ctrlKey || event.altKey) return null;

  const digitIndex = DIGIT_TO_INDEX[event.code];
  if (digitIndex != null) return { type: 'selectOption', optionIndex: digitIndex };

  const letterIndex = LETTER_TO_INDEX[event.code];
  if (letterIndex != null) return { type: 'selectOption', optionIndex: letterIndex };

  const key = event.key.length === 1 ? event.key.toLowerCase() : event.key.toLowerCase();
  if (key === 'n' || event.code === 'KeyN') return { type: 'next' };
  if (key === 'p' || event.code === 'KeyP') return { type: 'prev' };
  if (key === 'f' || event.code === 'KeyF') return { type: 'toggleFlag' };

  return null;
}

/** Announce remaining time via aria-live every 5 minutes (not every second). */
export const TIMER_ARIA_LIVE_INTERVAL_SEC = 5 * 60;

export function shouldAnnounceTimerRemaining(
  timeRemainingSec: number | null,
  lastAnnouncedAtSec: number | null,
  intervalSec: number = TIMER_ARIA_LIVE_INTERVAL_SEC
): boolean {
  if (timeRemainingSec == null || timeRemainingSec < 0) return false;
  if (lastAnnouncedAtSec == null) return true;
  if (timeRemainingSec === 0) return lastAnnouncedAtSec !== 0;
  return lastAnnouncedAtSec - timeRemainingSec >= intervalSec;
}

export function formatTimerAnnouncement(timeRemainingSec: number): string {
  const mins = Math.floor(timeRemainingSec / 60);
  const secs = timeRemainingSec % 60;
  if (timeRemainingSec === 0) return 'Tiempo agotado';
  if (mins === 0) return secs === 1 ? 'Queda 1 segundo' : `Quedan ${secs} segundos`;
  const minLabel = mins === 1 ? '1 minuto' : `${mins} minutos`;
  if (secs === 0) return mins === 1 ? `Queda ${minLabel}` : `Quedan ${minLabel}`;
  return mins === 1
    ? `Queda ${minLabel} y ${secs} segundos`
    : `Quedan ${minLabel} y ${secs} segundos`;
}
