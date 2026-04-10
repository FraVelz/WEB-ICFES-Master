'use client';

import { ICONS } from './icons';

const SIZES = {
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
  '2xl': 40,
  '3xl': 48,
} as const;

export type IconName = keyof typeof ICONS;
export type IconSize = keyof typeof SIZES;

interface IconProps {
  /** Known keys from `ICONS`; runtime strings (e.g. API-driven) are allowed. */
  name: IconName | string;
  className?: string;
  size?: IconSize;
}

export function Icon({ name, className = '', size = 'md' }: IconProps) {
  const content = ICONS[name as IconName];
  const dimension = SIZES[size];

  if (!content) {
    console.warn(`Icon "${name}" not found`);
    return null;
  }

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      width={dimension}
      height={dimension}
      aria-hidden
    >
      {content}
    </svg>
  );
}
