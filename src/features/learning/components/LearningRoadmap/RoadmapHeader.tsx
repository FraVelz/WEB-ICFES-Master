import { Icon } from '@/shared/components/Icon';

/**
 * Componente de encabezado del mapa de aprendizaje
 */
export const RoadmapHeader = () => {
  return (
    <div>
      <h2 className="mb-6 text-3xl font-bold text-white">
        <Icon name="graduation-cap" className="mr-3 text-yellow-400" />
        Tu Ruta de Aprendizaje ICFES
      </h2>
      <p className="mb-2 text-slate-300">
        Cuatro secciones: Mapa Progresivo, Nivel Básico, Intermedio y Avanzado
      </p>
      <p className="text-sm text-slate-400">
        Comienza con el mapa visual de progresión, luego los fundamentos en cada
        materia y progresa hacia el examen completo
      </p>
    </div>
  );
};
