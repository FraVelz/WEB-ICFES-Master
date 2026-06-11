'use client';

import { cn } from '@/utils/cn';
import { ICONS } from './icons';
import { getIconRenderMode } from './iconRenderMode';

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

  const isStroke = getIconRenderMode(name) === 'stroke';

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke={isStroke ? 'currentColor' : 'none'}
      strokeWidth={isStroke ? 1.5 : undefined}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn('inline-block flex-none shrink-0', className)}
      width={dimension}
      height={dimension}
      style={{ minWidth: dimension, minHeight: dimension }}
      aria-hidden
    >
      {content}
    </svg>
  );
}
