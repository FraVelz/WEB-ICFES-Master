/** Duración por defecto del aplazamiento «evaluar más tarde». */
export const LEVEL_ASSESSMENT_SNOOZE_MS = 7 * 24 * 60 * 60 * 1000;

function snoozeKey(scope: string): string {
  return scope === 'demo' ? 'icfes_level_assessment_snooze_demo' : `icfes_level_assessment_snooze_${scope}`;
}

export function snoozeLevelAssessment(scope: string, durationMs = LEVEL_ASSESSMENT_SNOOZE_MS): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(snoozeKey(scope), String(Date.now() + durationMs));
}

export function isLevelAssessmentSnoozed(scope: string): boolean {
  if (typeof window === 'undefined') return false;

  const raw = localStorage.getItem(snoozeKey(scope));
  if (!raw) return false;

  const until = Number.parseInt(raw, 10);
  if (!Number.isFinite(until) || Date.now() >= until) {
    localStorage.removeItem(snoozeKey(scope));
    return false;
  }

  return true;
}

export function clearLevelAssessmentSnooze(scope: string): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(snoozeKey(scope));
}
