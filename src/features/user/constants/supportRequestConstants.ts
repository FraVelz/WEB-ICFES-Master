export const SUPPORT_CATEGORIES = [
  { value: 'technical', label: 'Error técnico' },
  { value: 'content', label: 'Contenido' },
  { value: 'suggestion', label: 'Sugerencia' },
  { value: 'other', label: 'Otro' },
] as const;

export type SupportCategory = (typeof SUPPORT_CATEGORIES)[number]['value'];
export type SupportKind = 'contact' | 'bug';

export const SUPPORT_MESSAGE_MIN = 10;
export const SUPPORT_MESSAGE_MAX = 4000;

export function isSupportCategory(value: string): value is SupportCategory {
  return SUPPORT_CATEGORIES.some((item) => item.value === value);
}
