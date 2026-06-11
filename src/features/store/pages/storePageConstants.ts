export const STORE_FILTERS = [
  { id: 'all', label: 'Todo' },
  { id: 'logo', label: 'Logos' },
  { id: 'powerup', label: 'Potenciadores' },
  { id: 'badge', label: 'Insignias' },
] as const;

export type StoreToast = { message: string; type: 'success' | 'error' };
