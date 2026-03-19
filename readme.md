# Web Icfes Master

Una plataforma interactiva para practicar preguntas y aprender temas del examen de estado ICFES (Saber 11). Diseñada con arquitectura **Feature-Based** y **Atomic Design** usando Next.js 15, React 19, Tailwind CSS 3 y Supabase.

## Características Principales

- **3 Niveles de Aprendizaje**:
  -  **Nivel Fácil**: Aprende bases con materiales estructurados y ejercicios básicos
  -  **Nivel Intermedio**: Practica exámenes individuales por materia
  -  **Nivel Avanzado**: Simulacro global ICFES de 200 preguntas en 3 horas
- **Práctica por Áreas**: Matemáticas, Lenguaje, Ciencias Naturales, Ciencias Sociales e Inglés
- **Examen Simulado Completo**: Resuelve todas las preguntas con temporizador configurable
- **Material de Estudio Avanzado**: Acceso a recursos educativos organizados por tema
- **Seguimiento de Progreso**: Visualiza tus estadísticas y áreas de mejora
- **Desafíos Diarios y Clasificatoria**: Compite y mantén rachas de estudio
- **Autenticación**: Inicio de sesión con email/contraseña y Google (Supabase Auth)
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
 features/               # Características organizadas por dominio
    exam/               # Feature de exámenes
       components/
          ExamConfigModal/
          AnswerSheet/
          ResultsAnalysis/
       pages/
          PracticePage/
          FullExamPage/
       hooks/
       utils/
    learning/           # Feature de aprendizaje con 3 niveles
       components/
          LearningFilters/
          MaterialsGrid/
          AdditionalResources/
       pages/
          LearningPage/  # Selector de niveles + contenido dinámico
       lessons/
       utils/
    logros/             # Feature de gamificación y badges
       pages/
          LogrosPage/     # 40+ logros por categoría
       hooks/
    progress/           # Feature de progreso
       pages/
    gamification/       # Feature de gamificación
       hooks/
    auth/               # Feature de autenticación
       components/
       pages/
    user/               # Feature de usuario
       hooks/
    store/              # Feature de tienda y planes
    home/               # Feature de inicio
        pages/
 shared/                 # Componentes y utilidades compartidas
    components/
       atoms/          # Componentes básicos
          Badge
          Button
          Card
          Progress
          Text
       molecules/      # Componentes compuestos
          AnswerOption
          FloatingFilterButton
          QuestionCard
          ResultsSummary
       organisms/      # Componentes complejos
           QuestionContent/  # Soporte para contenido avanzado
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
    utils/              # Funciones utilitarias
        formatters.js
        index.js
 core/                   # Datos y constantes globales
    data/
       questions.js
       learningMaterials.js
       index.js
    constants/
       areaInfo.js
       index.js
    index.js
 hooks/                  # Hooks personalizados
    useQuizLogic.js
    useGamification.js
    useUserData.js
    useProgress.js
    useExam.js
 services/               # Servicios (Supabase + API configurable)
    api.config.js       # Modo supabase, localStorage o api
    ExamService.js
    GamificationService.js
    ProgressService.js
    UserService.js
 context/                # Context API
    AuthContext.jsx
 app/                    # Rutas Next.js (App Router)
    layout.tsx           # Layout raíz
    (dashboard)/         # Rutas autenticadas (perfil, examen, logros, etc.)
    (auth)/              # Rutas de autenticación (login, signup, onboarding)
    privacidad/          # Página legal
    terminos/            # Página legal
 components/
    AppWithProviders.jsx # Wrapper React con providers
 App.jsx                 # Componente principal con rutas React
 styles/
    global.css           # Tailwind + estilos globales
    scrollAnimations.css
```

## Instalación y Configuración

### Requisitos Previos

- Node.js (v18 o superior)
- pnpm

### Instalación

```bash
git clone <url-repo>
cd WEB-ICFES-Master
pnpm install
```

### Configuración

Crea un archivo `.env.local` en la raíz con las variables necesarias (Firebase, API, etc.). Consulta `docs/setup/configuration.md` para el listado completo.

### Desarrollo Local

```bash
pnpm run dev
```

La aplicación se abrirá en `http://localhost:3000/`

### Compilar para Producción

```bash
pnpm run build
```

### Preview del Build de Producción

```bash
pnpm run preview
```

### Build Móvil (Android)

```bash
pnpm run build:apk    # Genera APK
pnpm run build:aab    # Genera AAB para Play Store
pnpm run mobile:sync  # Sincroniza con Capacitor
```

## Uso de la Plataforma

La aplicación está configurada para despliegue en GitHub Pages en el repositorio `WEB-ICFES-Master`:

- **URL de producción**: `https://fravelz.github.io/WEB-ICFES-Master/` (o Firebase Hosting)
- **Configuración**: `next.config.ts` con export estático, Tailwind y Firebase
- **Routing**: Next.js App Router con rutas agrupadas `(dashboard)` y `(auth)`
- **Deploy**: `pnpm run build` y subir `out/` o usar Vercel/Netlify
- **App móvil**: Capacitor para Android (APK/AAB)

Ver documentación: `docs/setup/` y `docs/integrations/playstore-deploy.md`

## Documentación Adicional

Carpeta: `docs/`

### Visión General
- **overview/executive-summary.md** - Resumen ejecutivo
- **overview/project-structure.md** - Estructura y arquitectura

### Configuración
- **setup/installation.md** - Instalación paso a paso
- **setup/configuration.md** - Variables de entorno y configuración
- **setup/cheatsheet.md** - Comandos rápidos

### Frontend
- **frontend/architecture.md** - Arquitectura Feature-Based
- **frontend/components-guide.md** - Guía de componentes
- **frontend/styles-guide.md** - Guía de estilos

### Backend y Datos
- **Supabase** - Base de datos y autenticación
- **backend/services-api.md** - API de servicios
- **data/content-schema.md** - Esquema de contenido

### Integraciones
- **integrations/playstore-deploy.md** - Despliegue en Play Store
- **integrations/payments.md** - Pasarela de pagos

## Próximas Mejoras Recomendadas

- Crear sistema de reportes y analytics avanzado
- Agregar videos tutoriales integrados
- Expandir app móvil a iOS (Capacitor)
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

## Cambios Recientes (Marzo 2026)

- **Arquitectura**:
  - Next.js 15 App Router con rutas `(dashboard)` y `(auth)`
  - API configurable: modo `localStorage` (desarrollo) o `api` (producción)
  - Servicios centralizados en `src/services/` con soporte dual

- **Características**:
  - Sistema de 3 niveles de aprendizaje (Fácil, Intermedio, Avanzado)
  - 40+ logros desbloqueables con gamificación
  - Autenticación con Supabase y persistencia en PostgreSQL
  - Planes de suscripción: Gratuito, Pro, Premium, Anual
  - Build móvil con Capacitor (APK/AAB para Android)

- **Documentación**:
  - Nueva estructura en `docs/` (overview, setup, frontend, backend, integrations)

---

Desarrollo: Fravelz  
Última actualización: 18 de marzo de 2026  
Licencia: MIT
