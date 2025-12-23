#  Mapa de Carpetas - Estructura Escalable

##  Resumen Visual Rápido

```
src/
 features/           FEATURES PRINCIPALES (características del app)
 shared/             CÓDIGO COMÚN (componentes + utilidades reutilizables)
 core/               DATOS Y CONSTANTES GLOBALES
 pages/              (LEGADO - páginas sin migrar aún)
 components/         (LEGADO - componentes viejos)
 data/               (LEGADO - datos sin migrar aún)
 utils/              (LEGADO - utilidades viejas)
```

---

##  GUÍA COMPLETA: Dónde está cada cosa

###  EXÁMENES (Practice + Full Exam)

 Qué  Ruta  Archivo 
--------------------
  Página de Practice Page  `features/exam/pages/PracticePage/`  `PracticePage.jsx` 
  Página de Examen Completo  `features/exam/pages/FullExamPage/`  `FullExamPage.jsx` 
  Modal de Configuración  `features/exam/components/ExamConfigModal/`  `ExamConfigModal.jsx` 
  Hoja de Respuestas  `features/exam/components/AnswerSheet/`  `AnswerSheet.jsx` 
  Análisis de Resultados  `features/exam/components/ResultsAnalysis/`  `ResultsAnalysis.jsx` 

**Importar así:**
```javascript
import { PracticePage, FullExamPage } from '@/features/exam/pages';
import { ExamConfigModal, AnswerSheet, ResultsAnalysis } from '@/features/exam/components';
```

---

###  APRENDIZAJE (Learning + Lessons)

 Qué  Ruta  Archivo 
--------------------
  Página de Aprendizaje  `features/learning/pages/LearningPage/`  `LearningPage.jsx` 
  Lecciones Matemáticas  `features/learning/lessons/mathematics/`  `Algebra.jsx`, `Geometria.jsx`, etc. 
  Lecciones de Lenguaje  `features/learning/lessons/lenguaje/`  `Gramatica.jsx`, `Comprension.jsx`, etc. 
  Lecciones de Ciencia  `features/learning/lessons/science/`  `Fisica.jsx`, `Quimica.jsx`, etc. 
  Lecciones Sociales  `features/learning/lessons/social/`  `Historia.jsx`, `Geografia.jsx`, etc. 
  Filtros  `features/learning/components/LearningFilters/`  `LearningFilters.jsx` 
  Grid de Materiales  `features/learning/components/MaterialsGrid/`  `MaterialsGrid.jsx` 
  Recursos Adicionales  `features/learning/components/AdditionalResources/`  `AdditionalResources.jsx` 

**Importar así:**
```javascript
import { LearningPage } from '@/features/learning/pages';
import { Algebra, Geometria } from '@/features/learning/lessons/mathematics';
```

---

###  PROGRESO

 Qué  Ruta  Archivo 
--------------------
  Página de Progreso  `features/progress/pages/ProgressPage/`  `ProgressPage.jsx` 

**Importar así:**
```javascript
import { ProgressPage } from '@/features/progress/pages';
```

---

###  INICIO

 Qué  Ruta  Archivo 
--------------------
  Página de Inicio  `features/home/pages/HomePage/`  `HomePage.jsx` 
  Sección Donación  `features/home/components/DonationSection/`  `DonationSection.jsx` 

**Importar así:**
```javascript
import { HomePage } from '@/features/home/pages';
import { DonationSection } from '@/features/home/components';
```

---

##  COMPONENTES COMPARTIDOS (shared/)

### Atoms (Elementos Básicos)

 Componente  Ruta  Uso 
----------------------
 Badge  `shared/components/atoms/Badge/`  Etiquetas, categorías, estados 
 Button  `shared/components/atoms/Button/`  Botones reutilizables 
 Card  `shared/components/atoms/Card/`  Contenedores de contenido 
 Progress  `shared/components/atoms/Progress/`  Barras de progreso 
 Text  `shared/components/atoms/Text/`  Textos con estilos predefinidos 

**Importar así:**
```javascript
import { Badge, Button, Card, Progress, Text } from '@/shared/components/atoms';
```

### Molecules (Componentes Simples)

 Componente  Ruta  Uso 
----------------------
 AnswerOption  `shared/components/molecules/AnswerOption/`  Opción de respuesta 
 FloatingFilterButton  `shared/components/molecules/FloatingFilterButton/`  Botón de filtro flotante 
 QuestionCard  `shared/components/molecules/QuestionCard/`  Tarjeta de pregunta 

**Importar así:**
```javascript
import { AnswerOption, FloatingFilterButton, QuestionCard } from '@/shared/components/molecules';
```

### Utilidades (Utils)

 Función  Ruta  Uso 
--------------------
 `formatTimeExtended()`  `shared/utils/formatters.js`  Convierte segundos a HH:MM:SS 

**Importar así:**
```javascript
import { formatTimeExtended } from '@/shared/utils';
```

---

##  CORE (Datos y Constantes Globales)

### Data

 Archivo  Qué contiene  Ruta 
---------------------------
 `questions.js`  Todas las preguntas (Math, Language, Science, Social)  `core/data/questions.js` 
 `learningMaterials.js`  Materiales de aprendizaje  `core/data/learningMaterials.js` 

**Importar así:**
```javascript
import { 
  MATHEMATICS_QUESTIONS,
  LANGUAGE_QUESTIONS,
  SCIENCE_QUESTIONS,
  SOCIAL_QUESTIONS 
} from '@/core/data/questions';
```

### Constantes

 Archivo  Qué contiene  Ruta 
---------------------------
 `areaInfo.js`  Información de áreas ICFES  `core/constants/areaInfo.js` 

**Importar así:**
```javascript
import { AREA_INFO } from '@/core/constants';
```

---

##  LEGADO (A migrar posteriormente)

Estos archivos aún no están migrados pero funcionan en la nueva estructura:

```
pages/                  ← (algunas páginas aún aquí)
 HomePage.jsx        (USAR: features/home/pages)
 LearningPage.jsx    (USAR: features/learning/pages)
 ProgressPage.jsx    (USAR: features/progress/pages)
 PracticePage.jsx    (USAR: features/exam/pages)
 FullExamPage.jsx    (USAR: features/exam/pages)
 lessons/            (USAR: features/learning/lessons)
 index.js            (re-exports a las nuevas rutas)
 ...

components/            ← (componentes viejos aún aquí)
 atoms/              (USAR: shared/components/atoms)
 molecules/          (USAR: shared/components/molecules)
 organisms/          (USAR: features/**/components)
 ...

data/                  ← (datos viejos aún aquí)
 questions.js        (USAR: core/data/questions)
 learningMaterials.js (USAR: core/data/learningMaterials)
 ...

utils/                 ← (utilidades viejas aún aquí)
 timeFormatter.js    (USAR: shared/utils/formatters)
 ...
```

---

##  Flujo de Importes Recomendado

### Opción 1: Importar directo (RECOMENDADO)
```javascript
// Limpio y claro
import { PracticePage } from '@/features/exam/pages';
import { formatTimeExtended } from '@/shared/utils';
import { AREA_INFO } from '@/core/constants';
```

### Opción 2: Importar desde índices
```javascript
// También funciona
import * as examFeature from '@/features/exam';
const { PracticePage } = examFeature.pages;
```

### Opción 3: Importar todo de un feature
```javascript
// Para cuando necesitas múltiples componentes
import * as exam from '@/features/exam';
```

---

##  Checklist: Después de migraciones futuras

- [ ] Mover todas las páginas a `features/*/pages`
- [ ] Mover todos los atoms a `shared/components/atoms`
- [ ] Mover todos los molecules a `shared/components/molecules`
- [ ] Mover todos los organisms a sus features respectivos
- [ ] Consolidar datos en `core/data`
- [ ] Consolidar constantes en `core/constants`
- [ ] Consolidar utilidades en `shared/utils`
- [ ] Eliminar carpetas `pages`, `components`, `data`, `utils` del root
- [ ] Actualizar todos los imports en toda la app

---

##  Para Agregar NUEVA Feature

1. Crea carpeta: `src/features/mi-feature/`
2. Estructura dentro:
   ```
   mi-feature/
    components/
    pages/
    hooks/
    utils/
    index.js
   ```
3. Crea `index.js` que exporte todo
4. Importa desde: `@/features/mi-feature`

---

##  Resumen Rápido

 Necesito...  Voy a... 
--------------------
 Una página de feature  `features/<feature>/pages/` 
 Un componente de feature  `features/<feature>/components/` 
 Un componente reutilizable  `shared/components/atoms o molecules/` 
 Datos globales  `core/data/` 
 Constantes globales  `core/constants/` 
 Utilidades comunes  `shared/utils/` 

**Y siempre importo usando `@/` prefix para claridad y facilidad.**

¡Tu código está listo para escalar! 
