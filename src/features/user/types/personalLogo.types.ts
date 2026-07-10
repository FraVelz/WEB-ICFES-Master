export const MAX_PERSONAL_LOGOS = 2;
export const PERSONAL_LOGO_MAX_BYTES = 2 * 1024 * 1024;
const PERSONAL_LOGO_ID_PREFIX = 'personal_logo_';

export interface PersonalLogo {
  id: string;
  image: string;
  label: string;
  createdAt: string;
}

export function isPersonalLogoId(logoId: string | null | undefined): boolean {
  return typeof logoId === 'string' && logoId.startsWith(PERSONAL_LOGO_ID_PREFIX);
}

export function createPersonalLogoId(): string {
  const suffix = typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : String(Date.now());
  return `${PERSONAL_LOGO_ID_PREFIX}${suffix}`;
}
