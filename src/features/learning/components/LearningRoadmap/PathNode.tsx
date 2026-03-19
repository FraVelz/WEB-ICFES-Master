import React from 'react';
import { Icon } from '@/shared/components/Icon';

// Mapeo de colores para bordes y sombras para asegurar que Tailwind los detecte
const BORDER_COLORS = {
  blue: 'border-blue-500/50',
  green: 'border-green-500/50',
  purple: 'border-purple-500/50',
  orange: 'border-orange-500/50',
  pink: 'border-pink-500/50',
  indigo: 'border-indigo-500/50',
  slate: 'border-slate-500/50',
};

const SHADOW_COLORS = {
  blue: 'shadow-blue-500/30',
  green: 'shadow-green-500/30',
  purple: 'shadow-purple-500/30',
  orange: 'shadow-orange-500/30',
  pink: 'shadow-pink-500/30',
  indigo: 'shadow-indigo-500/30',
  slate: 'shadow-slate-500/30',
};

export const PathNode = ({
  status = 'incomplete', // incomplete, available, completed
  type = 'lesson', // lesson, checkpoint
  title,
  description,
  icon,
  onClick,
  colorClass = 'bg-blue-500',
}) => {
  const isCheckpoint = type === 'checkpoint';
  const isAvailable = status === 'available';
  const isCompleted = status === 'completed';

  // Extraer el nombre del color (ej: 'blue' de 'bg-blue-500')
  const colorName = colorClass.split('-')[1] || 'slate';
  const borderColor = BORDER_COLORS[colorName] || BORDER_COLORS.slate;
  const shadowColor = SHADOW_COLORS[colorName] || SHADOW_COLORS.slate;

  // Configuración de estilos base
  const getStyles = () => {
    if (status === 'incomplete') {
      return {
        container: 'bg-slate-800 border-slate-700 text-slate-500',
        iconColor: 'text-slate-600',
        lineColor: 'bg-slate-800',
      };
    }
    if (isCompleted) {
      return {
        container: 'bg-yellow-500 border-yellow-600 text-yellow-900',
        iconColor: 'text-yellow-900',
        lineColor: 'bg-yellow-500',
      };
    }
    // Available
    return {
      container: `${colorClass} border-white/20 text-white shadow-lg ${shadowColor}`,
      iconColor: 'text-white',
      lineColor: colorClass,
    };
  };

  const styles = getStyles();

  return (
    <div
      onClick={onClick}
      className={`group relative flex w-full cursor-pointer items-center gap-4 rounded-2xl border-2 p-4 transition-all duration-200 ${status === 'incomplete' ? 'border-slate-800 bg-slate-900/50 hover:border-slate-700' : ''} ${isAvailable ? `${borderColor} bg-slate-900 hover:bg-slate-800` : ''} ${isCompleted ? 'border-yellow-500/30 bg-slate-900/50 hover:bg-slate-900' : ''} `}
    >
      {/* Indicador de Estado (Círculo Izquierdo) */}
      <div
        className={`relative flex shrink-0 items-center justify-center rounded-full border-b-4 transition-transform group-hover:scale-105 ${isCheckpoint ? 'h-16 w-16 text-2xl' : 'h-12 w-12 text-lg'} ${styles.container} `}
      >
        <Icon
          name={isCompleted ? 'check' : icon || 'star'}
          className={styles.iconColor}
        />

        {/* Ping animation for available */}
        {isAvailable && (
          <div
            className={`absolute inset-0 rounded-full ${colorClass} animate-ping opacity-20`}
          />
        )}
      </div>

      {/* Contenido de Texto */}
      <div className="min-w-0 flex-1">
        <h4
          className={`truncate text-base font-bold ${isCompleted ? 'text-yellow-500' : isAvailable ? 'text-white' : 'text-slate-500'}`}
        >
          {title}
        </h4>
        <p className="truncate text-xs text-slate-400">{description}</p>
      </div>

      {/* Botón de Acción (Solo visible si disponible o completado) */}
      {(isAvailable || isCompleted) && (
        <div
          className={`flex h-8 w-8 items-center justify-center rounded-full ${isAvailable ? 'bg-white text-slate-900' : 'bg-slate-800 text-yellow-500'} `}
        >
          <Icon
            name={isAvailable ? 'play' : 'check'}
            size="sm"
            className={isAvailable ? 'text-slate-900' : 'text-yellow-500'}
          />
        </div>
      )}
    </div>
  );
};
