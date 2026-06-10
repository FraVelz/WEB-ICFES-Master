export const PROFILE_REPORT_REASONS = [
  { value: 'inappropriate_content', label: 'Contenido inapropiado' },
  { value: 'harassment', label: 'Acoso o bullying' },
  { value: 'spam', label: 'Spam o publicidad' },
  { value: 'impersonation', label: 'Suplantación de identidad' },
  { value: 'other', label: 'Otro motivo' },
] as const;

export type ProfileReportReason = (typeof PROFILE_REPORT_REASONS)[number]['value'];

export const PROFILE_REPORT_DETAILS_MIN = 10;
export const PROFILE_REPORT_DETAILS_MAX = 2000;
