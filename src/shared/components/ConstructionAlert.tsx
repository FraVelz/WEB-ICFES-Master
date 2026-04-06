import React from 'react';
import { cn } from '@/utils/cn';
import { Icon } from '@/shared/components/Icon';

/**
 * Componente de alerta para secciones en construcción
 * TODO: Eliminar este componente cuando los módulos estén finalizados
 */
interface ConstructionAlertProps {
  moduleName?: string;
  className?: string;
}
export const ConstructionAlert = ({ moduleName, className = '' }: ConstructionAlertProps) => {
  return (
    <div
      className={cn(
        'mx-4 mb-6 max-w-7xl rounded-r-lg border-l-4 border-yellow-500 bg-yellow-500/10 p-4 backdrop-blur-sm md:mx-auto',
        className
      )}
    >
      <div className="flex items-start">
        <div className="shrink-0">
          <Icon name="hard-hat" size="md" className="h-5 w-5 text-yellow-500" />
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-yellow-500">
            {moduleName ? `Módulo ${moduleName} en Construcción` : 'En Construcción'}
          </h3>
          <div className="mt-1 text-sm text-yellow-200/80">
            <p>Este apartado está en desarrollo activo. Faltan configuraciones y funcionalidades finales.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
