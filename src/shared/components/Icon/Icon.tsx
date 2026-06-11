'use client';

import {
  Children,
  cloneElement,
  Fragment,
  isValidElement,
  type ReactElement,
  type ReactNode,
  type SVGProps,
} from 'react';
import { cn } from '@/utils/cn';
import { ICONS } from './icons';

const SIZES = {
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
  '2xl': 40,
  '3xl': 48,
} as const;

const STROKE_SHAPES = new Set(['path', 'circle', 'rect', 'line', 'polyline', 'polygon', 'ellipse']);

export type IconName = keyof typeof ICONS;
export type IconSize = keyof typeof SIZES;

interface IconProps {
  /** Known keys from `ICONS`; runtime strings (e.g. API-driven) are allowed. */
  name: IconName | string;
  className?: string;
  size?: IconSize;
}

function applyIcons0PathDefaults(node: ReactNode): ReactNode {
  return Children.map(node, (child) => {
    if (!isValidElement(child)) return child;

    if (child.type === Fragment) {
      const fragmentChild = child as ReactElement<{ children?: ReactNode }>;
      return <Fragment key={fragmentChild.key}>{applyIcons0PathDefaults(fragmentChild.props.children)}</Fragment>;
    }

    if (typeof child.type === 'string' && STROKE_SHAPES.has(child.type)) {
      const props = child.props as Record<string, unknown>;
      if (props.fill === 'currentColor') return child;

      const svgDefaults: SVGProps<SVGElement> = {
        fill: (props.fill as string | undefined) ?? 'none',
        stroke: (props.stroke as string | undefined) ?? 'currentColor',
        strokeWidth: (props.strokeWidth as number | string | undefined) ?? 1.5,
        strokeLinecap: (props.strokeLinecap as SVGProps<SVGElement>['strokeLinecap']) ?? 'round',
        strokeLinejoin: (props.strokeLinejoin as SVGProps<SVGElement>['strokeLinejoin']) ?? 'round',
      };

      return cloneElement(child, svgDefaults);
    }

    return child;
  });
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
      className={cn('inline-block shrink-0', className)}
      width={dimension}
      height={dimension}
      aria-hidden
    >
      {applyIcons0PathDefaults(content)}
    </svg>
  );
}
