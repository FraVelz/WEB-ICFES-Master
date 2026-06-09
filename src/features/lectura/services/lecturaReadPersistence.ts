import type { LecturaSectionId } from '../constants';

export const LECTURA_READ_CHANGE_EVENT = 'icfes:lectura-read-change';

const ALL_SECTION_IDS: LecturaSectionId[] = ['importancia', 'informacion', 'consejos'];

function storageKey(scopeId: string): string {
  return `icfes_lectura_read_${scopeId}`;
}

function parseStored(raw: string | null): LecturaSectionId[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((id): id is LecturaSectionId => ALL_SECTION_IDS.includes(id as LecturaSectionId));
  } catch {
    return [];
  }
}

export function loadLecturaReadSections(scopeId: string | null): LecturaSectionId[] {
  if (!scopeId || typeof window === 'undefined') return [];
  return parseStored(localStorage.getItem(storageKey(scopeId)));
}

export function saveLecturaReadSection(scopeId: string, sectionId: LecturaSectionId): LecturaSectionId[] {
  const current = loadLecturaReadSections(scopeId);
  if (current.includes(sectionId)) return current;
  const next = [...current, sectionId];
  localStorage.setItem(storageKey(scopeId), JSON.stringify(next));
  window.dispatchEvent(new CustomEvent(LECTURA_READ_CHANGE_EVENT, { detail: { scopeId, sectionId } }));
  return next;
}

export function clearLecturaReadSections(scopeId: string): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(storageKey(scopeId));
}
