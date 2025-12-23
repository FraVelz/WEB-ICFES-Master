import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGraduationCap } from '@fortawesome/free-solid-svg-icons';

/**
 * Componente de encabezado del mapa de aprendizaje
 */
export const RoadmapHeader = () => {
  return (
    <div>
      <h2 className="text-3xl font-bold text-white mb-6">
        <FontAwesomeIcon icon={faGraduationCap} className="text-yellow-400 mr-3" />
        Tu Ruta de Aprendizaje ICFES
      </h2>
      <p className="text-slate-300 mb-2">
        Cuatro secciones: Mapa Progresivo, Nivel Básico, Intermedio y Avanzado
      </p>
      <p className="text-slate-400 text-sm">
        Comienza con el mapa visual de progresión, luego los fundamentos en cada materia y progresa hacia el examen
        completo
      </p>
    </div>
  );
};
