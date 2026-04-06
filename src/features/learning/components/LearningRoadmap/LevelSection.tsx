import React from 'react';
import { Icon } from '@/shared/components/Icon';
import { cn } from '@/utils/cn';

/**
 * Componente para la sección collapsible de Básico, Intermedio o Avanzado
 */
export interface LevelSectionProps {
  config: { color?: 'green' | 'yellow' | 'red'; title?: string; subtitle?: string };
  isExpanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  icon?: string;
}

export const LevelSection = ({ config, isExpanded, onToggle, children, icon }: LevelSectionProps) => {
  const colorMap = {
    green: {
      borderColor: 'border-green-600',
      bgColor: 'bg-green-600/20',
      hoverBg: 'hover:bg-green-600/30',
      iconBg: 'bg-green-600/30',
      iconColor: 'text-green-400',
      chevronColor: 'text-green-400',
    },
    yellow: {
      borderColor: 'border-yellow-600',
      bgColor: 'bg-yellow-600/20',
      hoverBg: 'hover:bg-yellow-600/30',
      iconBg: 'bg-yellow-600/30',
      iconColor: 'text-yellow-400',
      chevronColor: 'text-yellow-400',
    },
    red: {
      borderColor: 'border-red-600',
      bgColor: 'bg-red-600/20',
      hoverBg: 'hover:bg-red-600/30',
      iconBg: 'bg-red-600/30',
      iconColor: 'text-red-400',
      chevronColor: 'text-red-400',
    },
  };

  const colors = colorMap[config.color ?? 'green'];

  return (
    <div className={cn('overflow-hidden rounded-2xl border-2', colors.borderColor, colors.bgColor)}>
      <div
        onClick={onToggle}
        className={cn('flex w-full cursor-pointer items-center justify-between p-6 transition-colors', colors.hoverBg)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onToggle();
          }
        }}
      >
        <div className="flex items-center gap-4">
          <div className={colors.iconBg + ' rounded-xl p-4'}>
            <Icon name={icon ?? 'book'} size="3xl" className={cn('text-3xl', colors.iconColor)} />
          </div>
          <div className="text-left">
            <h2 className="text-2xl font-bold text-white">{config.title ?? ''}</h2>
            <p className={colors.iconColor}>{config.subtitle ?? ''}</p>
          </div>
        </div>
        <Icon
          name="chevron-down"
          size="2xl"
          className={cn('text-2xl transition-transform duration-300', colors.chevronColor, isExpanded && 'rotate-180')}
        />
      </div>

      {isExpanded && <div className={cn('space-y-4 border-t p-6', colors.borderColor)}>{children}</div>}
    </div>
  );
};
