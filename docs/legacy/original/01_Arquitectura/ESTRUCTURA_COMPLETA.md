# Estructura de Carpetas - ICFES Master

## Vista General del Proyecto

```
pruebas-icfes/
 src/                          # Código fuente
 public/                       # Archivos estáticos
 NOTAS/                        # Documentación técnica
 dist/                         # Build de producción
 node_modules/                 # Dependencias (no editar)
 [Archivos de configuración]   # Raíz
```

---

##  Carpeta src/ - Código Fuente

### src/features/
**Características organizadas por dominio (Feature-Based Architecture)**

```
features/
 exam/
    components/               # Componentes del examen
       ExamConfigModal/      # Modal de configuración
       AnswerSheet/          # Hoja de respuestas
       ResultsAnalysis/      # Análisis de resultados
    pages/
       PracticePage/         # Práctica por área
       FullExamPage/         # Examen completo
    hooks/                    # useQuizLogic, useTimer
    utils/                    # Funciones de examen

 learning/
    components/               # Componentes de aprendizaje
       LearningFilters/      # Filtros de materiales
       MaterialsGrid/        # Grid de recursos
       AdditionalResources/  # Recursos extra
    pages/                    # Páginas de learning
    lessons/                  # Lecciones por materia
       mathematics/
       lenguaje/
       science/
       social/
    utils/

 progress/
    components/               # Componentes de progreso
       ProgressChart/        # Gráficas
       StatsCard/            # Tarjetas de stats
    pages/
       ProgressPage/         # Dashboard de progreso
    utils/

 home/
    components/               # Componentes de inicio
       HeroSection/
       AreasSection/
       FeaturesSection/
    pages/
       HomePage/
    utils/

 [Otras features]
     gamification/             # Sistema de gamificación
     store/                    # Tienda y suscripciones
     profile/                  # Perfil de usuario
```

### src/shared/
**Código reutilizable entre features**

```
shared/
 components/
    atoms/                    # Componentes base (Button, Badge, Input)
    molecules/                # Componentes simples (AnswerOption, Card)
    organisms/                # Componentes complejos
        QuestionContent/      # 10 tipos de contenido de preguntas
            TextContent
            ImageContent
            TableContent
            FormulaContent
            ChartContent
            TimelineContent
            CodeContent
            MapContent
            QuoteContent
            CompositeContent
 hooks/                        # Hooks reutilizables
    useQuizLogic             # Lógica de quiz
 utils/                        # Utilidades
    formatters.js            # Formateo de tiempo, etc
    [otros helpers]
 styles/                       # Estilos compartidos
 index.js                      # Exporta todo
```

### src/core/
**Datos y constantes globales**

```
core/
 constants/
    areaInfo.js              # Info de áreas ICFES
    [otros constantes]
 data/
    questions.js             # Re-export de preguntas
    learningMaterials.js     # Re-export de materiales
    index.js
 index.js
```

### src/services/
**Servicios de lógica de negocio**

```
services/
 BaseService.js               # Clase base
 UserService.js               # Gestión de usuarios
 ExamService.js               # Lógica de exámenes
 ProgressService.js           # Seguimiento de progreso
 GamificationService.js       # Sistema de rewards
 UserFirestoreService.js      # Firestore para usuarios
 ExamFirestoreService.js      # Firestore para exámenes
 ProgressFirestoreService.js  # Firestore para progreso
 GamificationFirestoreService.js  # Firestore para gamificación
 FirestoreServices.js         # Servicios generales Firebase
 api.config.js                # Configuración de APIs
 index.js
```

### src/config/
**Configuraciones**

```
config/
 firebase.js                  # Configuración de Firebase
```

### src/context/
**Context API para estado global**

```
context/
 AuthContext.jsx              # Autenticación
 [otros contexts]
```

### src/hooks/
**Hooks personalizados globales**

```
hooks/
 useAuth.js                   # Hook de autenticación
 useUser.js                   # Hook de usuario
 [otros hooks]
```

### src/utils/
**Utilidades globales**

```
utils/
 userProfile.js               # Datos de perfil usuario
 badgesStore.js               # Sistema de badges
 debugTools.js                # Herramientas de debug
 progressStorage.js           # Almacenamiento de progreso
 [otros utils]
```

### src/styles/
**Estilos globales**

```
styles/
 index.css                    # Estilos generales
```

### src/data/
**Datos de preguntas**

```
data/
 questions.js                 # Preguntas por área
    MATHEMATICS_QUESTIONS    # Array de preguntas
    LANGUAGE_QUESTIONS       # Array de preguntas
    SCIENCE_QUESTIONS        # Array de preguntas
    SOCIAL_QUESTIONS         # Array de preguntas
    ALL_QUESTIONS            # Todas las preguntas
 learningMaterials.js         # Materiales de estudio
     LEARNING_MATERIALS       # Array de recursos
```

### src/ - Archivos raíz

```
src/
 App.jsx                      # Componente principal
 main.jsx                     # Punto de entrada
 index.css                    # Estilos globales
 components/
     PrivateRoute.jsx         # Ruta protegida
     DemoRoute.jsx            # Ruta demo
```

---

##  Carpeta public/ - Archivos Estáticos

```
public/
 images/
     mathematics/
        algebra/             # Imágenes de álgebra
        geometry/            # Imágenes de geometría
        calculus/            # Imágenes de cálculo
        statistics/          # Imágenes de estadística
     lenguaje/
        grammar/             # Imágenes de gramática
        literature/          # Imágenes de literatura
        vocabulary/          # Imágenes de vocabulario
     science/
        physics/             # Imágenes de física
        chemistry/           # Imágenes de química
        biology/             # Imágenes de biología
        ecology/             # Imágenes de ecología
     social/
        history/             # Imágenes de historia
        geography/           # Imágenes de geografía
        economics/           # Imágenes de economía
     logos/                   # Logos y branding
```

---

##  Carpeta NOTAS/ - Documentación Técnica

```
NOTAS/
 README.md                           # Índice de documentación
    Punto de entrada para nuevos desarrolladores

 ARQUITECTURA_SERVICIOS.md           # Servicios y Firebase
    Diagrama de servicios
    Patrones de Firebase
    Estructura de Firestore
    Flujo de datos

 AUDITORIA_PAGINAS.md                # Análisis de páginas
    Páginas activas
    Páginas redundantes
    Dashboards y progreso
    Decisiones de consolidación

 CHECKLIST_FIREBASE.md               # Configuración Firebase
    Variables de entorno
    Setup inicial
    Autenticación
    Verificación de config

 CONTENIDO_PREGUNTAS_GUIA.md         # Guía de preguntas
    Tipos de contenido
    Estructura de datos
    Ejemplos de uso
    Validación

 DESIGN_IMPROVEMENTS.md              # Mejoras de diseño
    Cambios visuales
    Optimizaciones UI/UX
    Paleta de colores
    Componentes mejorados

 DEVELOPMENT.md                      # Guía de desarrollo
    Setup local
    Cómo ejecutar
    Estructura de archivos
    Tips de desarrollo

 DOCUMENTACION.md                    # Documentación completa
    Resumen de sistema
    Componentes disponibles
    Servicios
    Hooks
    Utilidades

 EJEMPLOS_PREGUNTAS_AVANZADAS.js     # Código de ejemplos
    Preguntas con imágenes
    Preguntas con tablas
    Preguntas con fórmulas
    Preguntas con gráficas
    Patrones completos

 EJEMPLOS_USO.md                     # Ejemplos de uso
    Cómo usar componentes
    Cómo usar hooks
    Cómo usar servicios
    Snippets de código

 ESTRUCTURA_ARCHIVOS.md              # Tabla de navegación
    Ubicación de cada componente
    Rutas de importación
    Ejemplos de imports
    Tabla de referencia

 ESTRUCTURA_DATOS_PREGUNTAS.md       # Formato de datos
    Tipos de contenido
    Estructura JSON
    Campos requeridos
    Ejemplos completos
    Validación

 ESTRUCTURA_NUEVA.md                 # Detalles técnicos
    Por qué Feature-Based
    Cómo agregar features
    Patrones recomendados
    Migración de código

 ESTRUCTURA_README.md                # Guía rápida
    Estructura escalable
    Cómo importar
    Guía de navegación
    FAQs

 ESTRUCTURA_VISUAL.md                # Visualizaciones
    Diagramas ASCII
    Flujos de datos
    Ejemplos antes/después
    Estadísticas

 GUIA_CONTENIDO_PREGUNTAS.md         # Guía completa
    Componentes de contenido
    Cómo crear preguntas
    Mejores prácticas
    Checklist

 MEJORAS_IMPLEMENTADAS_DICIEMBRE.md  # Cambios recientes
    Features nuevos
    Bug fixes
    Optimizaciones
    Cambios visuales

 QUICK_REFERENCE.md                  # Referencia rápida
    Comandos npm
    Atajos comunes
    Snippets útiles
    Troubleshooting

 REFERENCIA_RAPIDA.md                # Referencia alternativa
    Estructura de carpetas
    Patrones comunes
    Ejemplos rápidos
    Recursos útiles

 RESUMEN.md                          # Resumen ejecutivo
    Qué es el proyecto
    Características
    Tecnologías usadas
    Estadísticas
    Próximos pasos

 SISTEMA_CONTENIDO_AVANZADO.md       # Sistema de contenido
    10 tipos de contenido
    Cómo usarlos
    Ejemplos complejos
    Validación

 STYLES_GUIDE.md                     # Guía de estilos
    Paleta de colores
    Tipografía
    Componentes estilizados
    Espaciado
    Responsive design

 VISUALIZACION_SISTEMA.md            # Visualizaciones completas
     Estructura visual
     Flujos de usuarios
     Diagramas
     Exemplos
```

---

##  Carpeta dist/ - Build de Producción

```
dist/
 index.html                   # HTML principal
 assets/
    index-HASH.js            # JavaScript bundleado
    index-HASH.css           # CSS bundleado
 [otros archivos estáticos]
```

*Generado automáticamente por: `npm run build`*

---

##  Archivos de Raíz

```
pruebas-icfes/
 package.json                 # Dependencias y scripts npm
 package-lock.json            # Lock file (no editar)
 vite.config.js               # Configuración de Vite
 tailwind.config.js           # Configuración de Tailwind CSS
 eslint.config.js             # Configuración de ESLint
 input.css                    # CSS global (entrada)
 output.css                   # CSS generado (salida)
 index.html                   # HTML de desarrollo
 readme.md                    # README principal del proyecto
 start.sh                     # Script para iniciar
 deploy.sh                    # Script para deploy
 LIMPIEZA_COMPLETADA.md       # Registro de limpieza
```

---

##  Resumen por Tipo de Archivo

### Archivos que Modificarás Frecuentemente

| Ubicación | Tipo | Propósito |
|-----------|------|----------|
| `src/features/*/pages/` | React | Nuevas páginas |
| `src/features/*/components/` | React | Nuevos componentes |
| `src/shared/components/` | React | Componentes reutilizables |
| `src/data/questions.js` | JavaScript | Agregar preguntas |
| `src/services/` | JavaScript | Lógica de negocio |
| `public/images/` | Imágenes | Recursos visuales |
| `NOTAS/` | Markdown | Documentación |

### Archivos que NO Debes Modificar

| Ubicación | Razón |
|-----------|-------|
| `node_modules/` | Dependencias (usar npm) |
| `dist/` | Generado (usar npm run build) |
| `package-lock.json` | Lock file (generado automáticamente) |
| `.env.local` | Secretos (solo local) |

---

##  Flujo de Adición de Contenido

### Agregar Nueva Pregunta
```
1. Editar: src/data/questions.js
   - MATHEMATICS_QUESTIONS[] 
   - LANGUAGE_QUESTIONS[]
   - SCIENCE_QUESTIONS[]
   - SOCIAL_QUESTIONS[]
2. Usar formato de: ESTRUCTURA_DATOS_PREGUNTAS.md
3. Test en: PracticePage o FullExamPage
```

### Agregar Nueva Página
```
1. Crear: src/features/[feature]/pages/[NombrePage]/
2. Crear componentes: src/features/[feature]/components/
3. Actualizar: src/App.jsx con ruta
4. Documentar en: NOTAS/ESTRUCTURA_ARCHIVOS.md
```

### Agregar Nuevo Feature
```
1. Crear: src/features/[nueva_feature]/
2. Dentro: pages/, components/, hooks/, utils/
3. Crear: src/features/[nueva_feature]/index.js
4. Importar en: src/App.jsx
5. Documentar en: NOTAS/
```

---

##  Checklist de Ubicación de Archivos

Usa esta tabla para encontrar dónde debería ir tu código:

| ¿Qué es? | ¿Dónde va? |
|----------|-----------|
| Componente que se usa en 1 lugar | `src/features/[feature]/components/` |
| Componente que se usa en varios features | `src/shared/components/` |
| Página principal de feature | `src/features/[feature]/pages/` |
| Hook personalizado para 1 feature | `src/features/[feature]/hooks/` |
| Hook que usan varios features | `src/shared/hooks/` |
| Utilidades para 1 feature | `src/features/[feature]/utils/` |
| Utilidades globales | `src/shared/utils/` |
| Constantes globales | `src/core/constants/` |
| Datos (preguntas, etc) | `src/data/` o `src/core/data/` |
| Servicios de negocio | `src/services/` |
| Contextos globales | `src/context/` |
| Imágenes por área | `public/images/[area]/` |
| Estilos globales | `src/styles/` o `src/index.css` |
| Documentación técnica | `NOTAS/` |

---

##  Guía Rápida de Imports

```javascript
// Features
import { PracticePage } from '@/features/exam/pages';
import { ExamConfigModal } from '@/features/exam/components';

// Shared
import { Button, Badge } from '@/shared/components/atoms';
import { AnswerOption } from '@/shared/components/molecules';
import { useQuizLogic } from '@/shared/hooks';
import { formatTimeExtended } from '@/shared/utils';

// Core
import { AREA_INFO } from '@/core/constants';
import { MATHEMATICS_QUESTIONS } from '@/core/data';

// Data
import { ALL_QUESTIONS } from '@/data/questions';

// Services
import { ExamService } from '@/services';

// Context
import { useAuth } from '@/context/AuthContext';
```

---

**Última actualización**: 13 de diciembre de 2025
