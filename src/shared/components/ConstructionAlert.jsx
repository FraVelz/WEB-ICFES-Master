import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHardHat } from '@fortawesome/free-solid-svg-icons';

/**
 * Componente de alerta para secciones en construcción
 * TODO: Eliminar este componente cuando los módulos estén finalizados
 */
export const ConstructionAlert = ({ moduleName, className = '' }) => {
  return (
    <div className={`bg-yellow-500/10 border-l-4 border-yellow-500 p-4 mb-6 mx-4 md:mx-auto max-w-7xl rounded-r-lg backdrop-blur-sm ${className}`}>
      <div className="flex items-start">
        <div className="shrink-0">
          <FontAwesomeIcon icon={faHardHat} className="h-5 w-5 text-yellow-500" />
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-yellow-500">
            {moduleName ? `Módulo ${moduleName} en Construcción` : 'En Construcción'}
          </h3>
          <div className="mt-1 text-sm text-yellow-200/80">
            <p>
              Este apartado está en desarrollo activo. Faltan configuraciones y funcionalidades finales.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
