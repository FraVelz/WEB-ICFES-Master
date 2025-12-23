# Nueva Estructura de Carpetas - Escalable y Mantenible

##  Estructura de Archivos

```
src/
 features/                          #  Features organizadas por dominio
    exam/                          # Feature: Exámenes (Practice + Full)
       components/                # Componentes específicos de examen
          ExamConfigModal/
          AnswerSheet/
          ResultsAnalysis/
          index.js
       pages/                     # Páginas del feature
          PracticePage/
          FullExamPage/
          index.js
       hooks/                     # Hooks específicos (si los hay)
       utils/                     # Utilidades específicas
       index.js
    learning/                      # Feature: Aprendizaje
       components/
       pages/
       lessons/                   # Lecciones por área
       index.js
    progress/                      # Feature: Progreso
       pages/
       index.js
    home/                          # Feature: Inicio
       pages/
       components/
       index.js
    index.js

 shared/                            #  Código compartido (No feature-específico)
    components/
       atoms/                     # Elementos básicos reutilizables
          Badge/
          Button/
          Card/
          Progress/
          Text/
          index.js
       molecules/                 # Componentes simples
          AnswerOption/
          FloatingFilterButton/
          QuestionCard/
          index.js
       index.js
    hooks/                         # Custom hooks compartidos
       index.js
    utils/                         # Funciones utilitarias
       formatters.js              # timeFormatter + otros formateadores
       helpers.js
       index.js
    index.js

 core/                              #  Datos y configuración global
    data/
       questions.js
       learningMaterials.js
       index.js
    constants/
       areaInfo.js               # Información de áreas ICFES
       colors.js                 # Paleta de colores (opcional)
       index.js
    index.js

 App.jsx
 main.jsx
 index.css
 App.css
```

##  Guía de Navegación

### ¿Dónde está cada cosa?

 Qué buscas  Dónde está  Ruta 
----------------------------
 Páginas de examen (Practice)  `features/exam/pages/PracticePage/`  `/src/features/exam/pages/PracticePage/PracticePage.jsx` 
 Páginas de examen completo  `features/exam/pages/FullExamPage/`  `/src/features/exam/pages/FullExamPage/FullExamPage.jsx` 
 Modal de configuración  `features/exam/components/ExamConfigModal/`  `/src/features/exam/components/ExamConfigModal/ExamConfigModal.jsx` 
 Hoja de respuestas  `features/exam/components/AnswerSheet/`  `/src/features/exam/components/AnswerSheet/AnswerSheet.jsx` 
 Análisis de resultados  `features/exam/components/ResultsAnalysis/`  `/src/features/exam/components/ResultsAnalysis/ResultsAnalysis.jsx` 
 Página de inicio  `features/home/pages/HomePage/`  `/src/features/home/pages/HomePage/HomePage.jsx` 
 Página de aprendizaje  `features/learning/pages/LearningPage/`  `/src/features/learning/pages/LearningPage/LearningPage.jsx` 
 Página de progreso  `features/progress/pages/ProgressPage/`  `/src/features/progress/pages/ProgressPage/ProgressPage.jsx` 
 Lecciones de matemáticas  `features/learning/lessons/`  `/src/features/learning/lessons/mathematics/` 
 Lecciones de lenguaje  `features/learning/lessons/`  `/src/features/learning/lessons/lenguaje/` 
 Lecciones de ciencia  `features/learning/lessons/`  `/src/features/learning/lessons/science/` 
 Lecciones sociales  `features/learning/lessons/`  `/src/features/learning/lessons/social/` 
 Componentes reutilizables (Badge, Button, etc.)  `shared/components/atoms/`  `/src/shared/components/atoms/` 
 Componentes simples (AnswerOption, etc.)  `shared/components/molecules/`  `/src/shared/components/molecules/` 
 Función formatTimeExtended  `shared/utils/`  `/src/shared/utils/formatters.js` 
 Datos de preguntas  `core/data/`  `/src/core/data/questions.js` 
 Información de áreas ICFES  `core/constants/`  `/src/core/constants/areaInfo.js` 

##  Cómo importar

### Importar desde feature (exam)
```javascript
//  Correcto - Importar de index.js
import { PracticePage, FullExamPage } from '@/features/exam/pages';
import { ExamConfigModal, AnswerSheet, ResultsAnalysis } from '@/features/exam/components';

//  Evitar - Rutas directas
import { PracticePage } from '@/features/exam/pages/PracticePage/PracticePage.jsx';
```

### Importar desde shared
```javascript
//  Correcto
import { formatTimeExtended } from '@/shared/utils';
import { Badge, Button, Card } from '@/shared/components/atoms';
import { AnswerOption } from '@/shared/components/molecules';

//  Evitar
import { formatTimeExtended } from '@/shared/utils/formatters.js';
```

### Importar desde core
```javascript
//  Correcto
import { AREA_INFO } from '@/core/constants';
import { MATHEMATICS_QUESTIONS } from '@/core/data';

//  Evitar
import { AREA_INFO } from '@/core/constants/areaInfo.js';
```

##  Beneficios de esta estructura

###  Para Escalar
- **Fácil agregar features**: Crea nueva carpeta en `features/`
- **Bajo acoplamiento**: Features son independientes
- **Alto reutilización**: `shared/` centraliza código común

###  Para Mantener
- **Fácil localizar**: Buscas en `features/<nombre>` si es una feature
- **Fácil navegar**: `atoms/` → `molecules/` → `organisms` (escalera)
- **Fácil refactorizar**: Los cambios afectan solo una zona

###  Para Colaborar
- **Responsabilidades claras**: Cada feature en su carpeta
- **Conflictos reducidos**: Menos archivos compartidos
- **Legible**: Nuevos devs entienden la estructura al instante

##  Ejemplo: Agregar nueva feature "Analytics"

```
features/
 exam/
 learning/
 progress/
 home/
 analytics/               Nueva feature
     components/
        StatsCard/
        ChartWidget/
        index.js
     pages/
        AnalyticsPage/
        index.js
     hooks/
     utils/
     index.js
```

##  Actualizar imports

**Antigua estructura:**
```javascript
import { PracticePage } from './pages/PracticePage';
import { ExamConfigModal } from './components/organisms/ExamConfigModal';
```

**Nueva estructura:**
```javascript
import { PracticePage } from '@/features/exam/pages';
import { ExamConfigModal } from '@/features/exam/components';
```

##  Resumen

- **Features**: Aisladas, auto-contenidas, escalables
- **Shared**: Código común reutilizable
- **Core**: Datos y constantes globales
- **Clear naming**: Carpetas indican el tipo de contenido
- **Index exports**: Simplifica importes

¡Esta estructura está lista para crecer! 
