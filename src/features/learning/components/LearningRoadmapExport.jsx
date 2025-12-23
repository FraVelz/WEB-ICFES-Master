/**
 * ARCHIVO DE EXPORTACIÓN
 * 
 * Re-exporta el componente LearningRoadmap desde la carpeta modularizada:
 * ./LearningRoadmap/index.jsx
 * 
 * Estructura modularizada en carpeta:
 * ./LearningRoadmap/
 * ├── index.jsx (componente principal)
 * ├── constants.js (constantes de configuración)
 * ├── hooks.js (custom hooks)
 * ├── iconMap.js (mapeo de iconos)
 * ├── ICFESLevelCard.jsx (card individual de nivel)
 * ├── ProgressOverview.jsx (estadísticas de progreso)
 * ├── RoadmapHeader.jsx (encabezado)
 * ├── LevelSection.jsx (sección collapsible)
 * ├── CTASection.jsx (call to action)
 * ├── SectionContent.jsx (contenido de secciones)
 * └── README.md
 */

// Importar desde la carpeta LearningRoadmap (no del archivo con el mismo nombre)
import { LearningRoadmap } from './LearningRoadmap/index';

export { LearningRoadmap };
