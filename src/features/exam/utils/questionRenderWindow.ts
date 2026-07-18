/**
 * Client render window for practice runner — keep current + prefetch next in DOM,
 * not the full session list (avoids mounting dozens of question cards at once).
 */
export const PRACTICE_RENDER_PREFETCH_AHEAD = 1;
export const PRACTICE_RENDER_LOOKBEHIND = 0;

export type QuestionRenderWindow = {
  start: number;
  end: number; // exclusive
  indices: number[];
};

export function getQuestionRenderWindow(
  currentIndex: number,
  total: number,
  prefetchAhead: number = PRACTICE_RENDER_PREFETCH_AHEAD,
  lookbehind: number = PRACTICE_RENDER_LOOKBEHIND
): QuestionRenderWindow {
  if (total <= 0) return { start: 0, end: 0, indices: [] };
  const safeCurrent = Math.min(Math.max(0, currentIndex), total - 1);
  const start = Math.max(0, safeCurrent - lookbehind);
  const end = Math.min(total, safeCurrent + 1 + Math.max(0, prefetchAhead));
  const indices = Array.from({ length: end - start }, (_, i) => start + i);
  return { start, end, indices };
}

/** Hard cap: practice fetch must stay well below a 200Q full-simulacro dump. */
export function assertPracticeFetchBelowFullSimulacro(limit: number, fullSimulacroSize = 200): boolean {
  return Number.isFinite(limit) && limit > 0 && limit < fullSimulacroSize;
}
