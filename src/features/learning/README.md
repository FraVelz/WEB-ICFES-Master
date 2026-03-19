# Learning Feature Structure

## Organización de archivos

La funcionalidad de Learning está organizada de la siguiente manera:

```
learning/
 pages/                          # Páginas principales
    index.js                    # Exporta todas las páginas
    Main/                       # Página principal de aprendizaje
       index.js
       LearningPage.jsx        # Selector de niveles (Básico, Intermedio, Avanzado)
       components/             # Componentes específicos de esta página
    Roadmap/                    # Página de ruta de aprendizaje
       index.js
       LearningRoadmapPage.jsx
       components/             # Componentes específicos
    ProgressiveICFES/           # Página del mapa progresivo ICFES
        index.js
        ProgressiveICFESMapPage.jsx
        components/             # Componentes específicos

 components/                     # Componentes reutilizables
    index.js                    # Exporta componentes principales
    Roadmap/                    # Componentes del Roadmap
       index.js
       LearningRoadmap.jsx     # Componente principal
       BasicoComponents.jsx    # Componentes del nivel básico
       IntermediaComponents.jsx # Componentes del nivel intermedio
       LevelComponents.jsx     # Componentes del nivel avanzado
    LearningFilters.jsx         # Filtros de materiales
    MaterialsGrid.jsx           # Grid de materiales
    AdditionalResources.jsx     # Recursos adicionales
    LearningPathMap.jsx         # Mapa de ruta
    ProgressiveICFESMap.jsx     # Mapa progresivo

 data/                           # Datos estáticos
    roadmapData.js              # Datos del roadmap (materias, tópicos)

 lessons/                        # Lecciones por categoría
    lenguaje/                   # Lecciones de lenguaje
    mathematics/                # Lecciones de matemáticas
    science/                    # Lecciones de ciencias
    social/                     # Lecciones de sociales

 index.js                        # Exporta la feature
```

## Características

### Pages (Páginas)

Cada página está organizada en su propia carpeta:

- **Main**: Selector de niveles de aprendizaje
  - Nivel Fácil: Aprende conceptos básicos
  - Nivel Intermedio: Practica por materia
  - Nivel Avanzado: Simulacro completo ICFES

- **Roadmap**: Ruta de aprendizaje estructurada
  - Nivel Básico: Fundamentos de 5 materias
  - Nivel Intermedio: Exámenes individuales
  - Nivel Avanzado: Simulacro ICFES 500

- **ProgressiveICFES**: Mapa progresivo de 0 a 500 puntos

### Components (Componentes)

#### Roadmap Components

- `LearningRoadmap`: Componente principal con 3 niveles
- `BasicoComponents`: Componentes para nivel básico (materias y tópicos)
- `IntermediaComponents`: Componentes para nivel intermedio (exámenes)
- `LevelComponents`: Componentes para nivel avanzado (simulacro)

#### Otros Componentes

- `LearningFilters`: Filtrado de materiales por área y tópico
- `MaterialsGrid`: Grid de visualización de materiales
- `AdditionalResources`: Recursos adicionales
- `LearningPathMap`: Mapa de ruta de aprendizaje
- `ProgressiveICFESMap`: Mapa progresivo ICFES

### Data (Datos)

- `roadmapData.js`:
  - `SUBJECTS`: Definición de las 5 materias
  - `BASICO_TOPICS`: Tópicos del nivel básico
  - `INTERMEDIO_TOPICS`: Información del nivel intermedio

### Lessons (Lecciones)

Lecciones organizadas por categoría:

- Lenguaje: Comprensión, Gramática, Literatura, Ortografía, Semántica
- Matemáticas: Álgebra, Cálculo, Geometría, Números Complejos, Trigonometría
- Ciencias: Biología, Ecología, Física, Química, Termodinámica
- Sociales: Ciudadanía, Economía, Filosofía, Geografía, Historia

## Imports

### Desde componentes

```javascript
import { LearningRoadmap } from '@/features/learning/components';
```

### Desde páginas

```javascript
import {
  LearningPage,
  LearningRoadmapPage,
  ProgressiveICFESMapPage,
} from '@/features/learning/pages';
```

## Ventajas de esta estructura

**Modular**: Cada página tiene sus propios componentes  
 **Escalable**: Fácil de agregar nuevas páginas o componentes  
 **Mantenible**: Organización clara y lógica  
 **Reutilizable**: Componentes compartidos en la carpeta principal  
 **Documentado**: Cada sección está claramente definida
