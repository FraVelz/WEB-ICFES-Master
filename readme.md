# Web Icfes Master

Una plataforma interactiva para practicar preguntas del examen de estado ICFES (Saber 11). Diseñada con arquitectura **Feature-Based** y **Atomic Design** usando React 19, Vite 7 y Tailwind CSS 4.

## Características Principales

- **3 Niveles de Aprendizaje**:
  - 🔵 **Nivel Fácil**: Aprende bases con materiales estructurados y ejercicios básicos
  - 🟠 **Nivel Intermedio**: Practica exámenes individuales por materia
  - 🔴 **Nivel Avanzado**: Simulacro global ICFES de 200 preguntas en 3 horas
- **Práctica por Áreas**: Matemáticas, Lenguaje, Ciencias Naturales, Ciencias Sociales e Inglés
- **Examen Simulado Completo**: Resuelve todas las preguntas con temporizador configurable
- **Material de Estudio Avanzado**: Acceso a recursos educativos organizados por tema
- **Seguimiento de Progreso**: Visualiza tus estadísticas y áreas de mejora
- **Sistema de Gamificación**: 40+ logros desbloqueables por categoría (Primeros Pasos, Rachas, Logros Académicos, Excelencia, Planes)
- **Planes de Suscripción**: Gratuito, Pro, Premium y Anual con beneficios progresivos
- **Sistema de Calificación**: Retroalimentación inmediata con explicaciones detalladas
- **Interfaz Responsiva**: Funciona perfectamente en móvil, tablet y desktop
- **Contenido Multimedia**: Soporta imágenes, tablas, fórmulas, gráficas y más

## Contenido de Preguntas

- **Matemáticas**: Álgebra, Geometría, Cálculo, Estadística
- **Lenguaje**: Gramática, Vocabulario, Comprensión, Literatura
- **Ciencias Naturales**: Biología, Física, Química, Ecología
- **Ciencias Sociales**: Historia, Geografía, Economía, Política
- **Inglés**: Vocabulario, Gramática, Comprensión de Lectura

Total: 40+ preguntas con contenido avanzado (imágenes, tablas, fórmulas, gráficas)

## Sistema de Logros (Gamificación)

### Categorías de Logros (40+ total)

1. **Primeros Pasos** (4 logros)
   - Primer Paso, Aprendiz, Perfeccionista Primerizo, Racha Inicial

2. **Rachas** (4 logros)
   - Semana de Fuego, Campeón Mensual, Leyenda de Rachas, Dedicado por un Año

3. **Logros Académicos** (8 logros)
   - Estudiante Dedicado, Maestro de Pruebas, Centinela del Conocimiento
   - Precisión, Impecable, Virtuoso

4. **Excelencia** (4 logros)
   - Excelencia, Maestro Integral, Rayo Veloz, Campeón de Consistencia

5. **Planes y Suscripciones** (16 logros)
   - Plan Gratuito: Usuario Gratuito, Explorador
   - Plan Pro: Usuario Pro, Poder Pro, Pro Avanzado
   - Plan Premium: Usuario Premium, Élite Premium, Maestría Premium, Centinela Premium
   - Plan Anual: Suscriptor Anual, Compromiso Anual, Leyenda Anual, Aprendiz de Vida

### Niveles y Experiencia

- Sistema de niveles progresivos basado en XP
- Desbloqueables según planes y actividad del usuario
- Visualización de progreso hacia el siguiente nivel

## Estructura del Proyecto (Feature-Based)

```bash
src/
├── features/               # Características organizadas por dominio
│   ├── exam/               # Feature de exámenes
│   │   ├── components/
│   │   │   ├── ExamConfigModal/
│   │   │   ├── AnswerSheet/
│   │   │   └── ResultsAnalysis/
│   │   ├── pages/
│   │   │   ├── PracticePage/
│   │   │   └── FullExamPage/
│   │   ├── hooks/
│   │   └── utils/
│   ├── learning/           # Feature de aprendizaje con 3 niveles
│   │   ├── components/
│   │   │   ├── LearningFilters/
│   │   │   ├── MaterialsGrid/
│   │   │   └── AdditionalResources/
│   │   ├── pages/
│   │   │   └── LearningPage/  # Selector de niveles + contenido dinámico
│   │   ├── lessons/
│   │   └── utils/
│   ├── logros/             # Feature de gamificación y badges
│   │   ├── pages/
│   │   │   └── LogrosPage/     # 40+ logros por categoría
│   │   └── hooks/
│   ├── progress/           # Feature de progreso
│   │   └── pages/
│   ├── gamification/       # Feature de gamificación
│   │   └── hooks/
│   ├── auth/               # Feature de autenticación
│   │   ├── components/
│   │   └── pages/
│   ├── user/               # Feature de usuario
│   │   └── hooks/
│   └── home/               # Feature de inicio
│       └── pages/
├── shared/                 # Componentes y utilidades compartidas
│   ├── components/
│   │   ├── atoms/          # Componentes básicos
│   │   │   ├── Badge
│   │   │   ├── Button
│   │   │   ├── Card
│   │   │   ├── Progress
│   │   │   └── Text
│   │   ├── molecules/      # Componentes compuestos
│   │   │   ├── AnswerOption
│   │   │   ├── FloatingFilterButton
│   │   │   ├── QuestionCard
│   │   │   └── ResultsSummary
│   │   └── organisms/      # Componentes complejos
│   │       └── QuestionContent/  # Soporte para contenido avanzado
│   │           ├── TextContent
│   │           ├── ImageContent
│   │           ├── TableContent
│   │           ├── FormulaContent
│   │           ├── ChartContent
│   │           ├── TimelineContent
│   │           ├── CodeContent
│   │           ├── MapContent
│   │           ├── QuoteContent
│   │           └── CompositeContent
│   └── utils/              # Funciones utilitarias
│       ├── formatters.js
│       └── index.js
├── core/                   # Datos y constantes globales
│   ├── data/
│   │   ├── questions.js
│   │   ├── learningMaterials.js
│   │   └── index.js
│   ├── constants/
│   │   ├── areaInfo.js
│   │   └── index.js
│   └── index.js
├── hooks/                  # Hooks personalizados
│   ├── useQuizLogic.js
│   ├── useGamificationFirestore.js
│   ├── useUserDataFirestore.js
│   ├── useProgressFirestore.js
│   └── useExamFirestore.js
├── services/               # Servicios de Firebase
│   ├── BaseService.js
│   ├── ExamFirestoreService.js
│   ├── GamificationFirestoreService.js
│   ├── ProgressFirestoreService.js
│   ├── UserFirestoreService.js
│   └── index.js
├── context/                # Context API
│   └── AuthContext.jsx
├── pages/                  # Re-exports para compatibilidad
│   └── index.js
├── App.jsx                 # Componente principal con rutas
├── App.css                 # Estilos de la app
├── index.css               # Estilos globales
└── main.jsx                # Punto de entrada
```

## Sistema de Importaciones (Alias)

### Requisitos Previos

- Node.js (v18 o superior)
- npm o pnpm

### Instalación

```bash
cd pruebas-icfes
npm install
```

### Desarrollo Local

```bash
npm run dev
```

La aplicación se abrirá en `http://localhost:5174/`

### Compilar para Producción

```bash
npm run build
```

### Preview del Build de Producción

```bash
npm run preview
```

## Uso de la Plataforma

La aplicación está configurada para despliegue en GitHub Pages en el repositorio `WEB-ICFES-Master`:

- **URL de producción**: `https://fravelz.github.io/WEB-ICFES-Master/`
- **Configuración**: `vite.config.js` con `base` condicional
- **Routing**: `main.jsx` configura basename para React Router automáticamente

Ver documentación: `GITHUB_PAGES_SETUP.md` y `GITHUB_PAGES_DEPLOY.md`

## Documentación Adicional

Carpeta: `/Documentacion/`

### Inicio Rápido
- **00_Inicio/DEVELOPMENT.md** - Guía de desarrollo
- **00_Inicio/QUICK_REFERENCE.md** - Referencia rápida

### Arquitectura
- **01_Arquitectura/ARQUITECTURA_SERVICIOS.md** - Servicios y Firebase
- **01_Arquitectura/ESTRUCTURA_ARCHIVOS.md** - Guía de navegación
- **01_Arquitectura/ESTRUCTURA_COMPLETA.md** - Vista general

### Contenido
- **02_Contenido/GUIA_CONTENIDO_PREGUNTAS.md** - Componentes de contenido
- **02_Contenido/ESTRUCTURA_DATOS_PREGUNTAS.md** - Formato de preguntas
- **02_Contenido/SISTEMA_CONTENIDO_AVANZADO.md** - Sistema completo

### Diseño
- **04_Diseño/DESIGN_IMPROVEMENTS.md** - Mejoras implementadas
- **04_Diseño/STYLES_GUIDE.md** - Guía de estilos

### Ejemplos
- **06_Ejemplos/EJEMPLOS_PREGUNTAS_AVANZADAS.js** - 8 ejemplos funcionales

## Próximas Mejoras Recomendadas

- ✅ Implementar gamificación (insignias, puntos) - **EN PROGRESO**
- ✅ Agregar autenticación de usuarios con Firebase - **EN PROGRESO**
- ✅ Almacenamiento en Firestore para resultados - **EN PROGRESO**
- Crear sistema de reportes y analytics avanzado
- Agregar videos tutoriales integrados
- Crear aplicación móvil con React Native
- Agregar exportación de resultados a PDF
- Implementar sistema de notificaciones push
- Integrar IA para recomendaciones personalizadas
- Agregar modo offline
- Crear comunidad y foros de discusión
- Sistema de referidos con recompensas

## Requisitos para Contribuir

1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## Contacto

Para sugerencias o reporte de errores, crea un issue en el repositorio de GitHub.

## Cambios Recientes (Diciembre 2025)

- **Nuevas Características**:
  - Sistema de 3 niveles de aprendizaje (Fácil, Intermedio, Avanzado)
  - 40+ logros desbloqueables con sistema de gamificación
  - Integración con Firestore para persistencia de datos
  - Logros por categoría: Primeros Pasos, Rachas, Académicos, Excelencia, Planes
  - Soporte para 5 planes de suscripción distintos

- **Mejoras de UI/UX**:
  - Reemplazo de emojis por iconos FontAwesome
  - Diseño moderno con gradientes y efectos de glow
  - Interfaz responsiva mejorada
  - Animaciones suaves en todas las transiciones

---

Desarrollo: Fravelz
Última actualización: 13 de diciembre de 2025
Licencia: MIT
