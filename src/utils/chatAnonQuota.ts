/** Cuota de mensajes del asistente para usuarios sin sesión (persistencia en cliente). */
export const CHAT_ANON_STORAGE_KEY = 'icfes_chat_anon_used';
export const CHAT_ANON_LIMIT = 3;

export function getAnonUsedFromStorage(): number {
  if (typeof window === 'undefined') return 0;
  const raw = localStorage.getItem(CHAT_ANON_STORAGE_KEY);
  const n = raw !== null ? parseInt(raw, 10) : 0;
  return Number.isFinite(n) && n >= 0 ? n : 0;
}

export function setAnonUsedInStorage(used: number): void {
  localStorage.setItem(CHAT_ANON_STORAGE_KEY, String(Math.max(0, used)));
}
