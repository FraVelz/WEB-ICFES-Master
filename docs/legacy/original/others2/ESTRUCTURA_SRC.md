#  Estructura Actual de `src/`

## Resumen Ejecutivo

La aplicación sigue una arquitectura **Feature-Based** combinada con **Atomic Design**, organizada en capas funcionales y características reutilizables.

---

##  Estructura Completa

```
src/
 App.jsx                          # Componente principal con todas las rutas
 main.jsx                         # Punto de entrada de la aplicación
 index.css                        # Estilos globales

 config/                          # Configuraciones globales
    firebase.js                  # Configuración de Firebase

 context/                         # Context API para estado global
    AuthContext.jsx              # Contexto de autenticación (usuario, login, logout)

 components/                      # Componentes locales de App
    PrivateRoute.jsx             # Componente para rutas protegidas
    DemoRoute.jsx                # Componente para rutas en modo demo

 pages/                           # Páginas no incluidas en features
    LogrosPage/
        index.jsx                # Página de logros/achievements

 core/                            # Core business logic y datos globales
    index.js                     # Exports principales
    constants/                   # Constantes de la aplicación
       areaInfo.js              # Información de áreas de estudio
       index.js                 # Exports
    data/                        # Datos estáticos
        index.js                 # Exports
        learningMaterials.js     # Material de aprendizaje
        questions.js             # Base de preguntas

 hooks/                           # Hooks personalizados reutilizables
    FirestoreHooks.js            # Hooks base para Firestore
    index.js                     # Exports
    useExam.js                   # Lógica de exámenes
    useExamFirestore.js          # Exámenes en Firestore
    useGamification.js           # Gamificación
    useGamificationFirestore.js  # Gamificación en Firestore
    useProgress.js               # Progreso del usuario
    useProgressFirestore.js      # Progreso en Firestore
    useQuizLogic.js              # Lógica del quiz
    useScrollAnimation.js        # Animaciones al scroll
    useUser.js                   # Datos del usuario
    useUserData.js               # Datos completos del usuario
    useUserDataFirestore.js      # Datos de usuario en Firestore
    useUserFirebase.js           # Integración Firebase usuario

 services/                        # Servicios de negocio
    index.js                     # Exports
    api.config.js                # Configuración de API
    BaseService.js               # Clase base para servicios
    ExamService.js               # Servicio de exámenes
    ExamFirestoreService.js      # Exámenes en Firestore
    GamificationService.js       # Servicio de gamificación
    GamificationFirestoreService.js # Gamificación en Firestore
    ProgressService.js           # Servicio de progreso
    ProgressFirestoreService.js  # Progreso en Firestore
    UserService.js               # Servicio de usuarios
    UserFirestoreService.js      # Usuarios en Firestore

 shared/                          # Código compartido entre features
    index.js                     # Exports
    components/                  # Componentes reutilizables
       Header.jsx               # Header de navegación
    utils/                       # Utilidades compartidas

 styles/                          # Estilos globales
    scrollAnimations.css         # Animaciones de scroll

 features/                        # Features principales (Feature-Based)
    
     home/                        # Feature: Página de inicio
        index.js                 # Exports: pages y components
        pages/
           index.js             # Exports de páginas
           HomePage.jsx         # Página principal
        components/
            index.js             # Exports
            DonationSection.jsx   # Sección de donaciones
    
     auth/                        # Feature: Autenticación
        index.js                 # Exports
        pages/
           index.js             # Exports
           LoginPage.jsx        # Página de login
           SignupPage.jsx       # Página de registro
           ForgotPasswordPage.jsx # Página de recuperación
           OnboardingPage.jsx   # Página de bienvenida
        components/              # (Vacío, sin componentes compartidos)
    
     exam/                        # Feature: Exámenes y práctica
        index.js                 # Exports
        pages/
           index.js             # Exports
           PracticePage.jsx     # Página de práctica
           FullExamPage.jsx     # Examen completo
           ClasificatoriaPage.jsx # Examen clasificatorio
        components/
            index.js             # Exports
            ExamConfigModal.jsx  # Modal de configuración
            AnswerSheet.jsx      # Hoja de respuestas
            ResultsAnalysis.jsx  # Análisis de resultados
            QuestionPanel.jsx    # Panel de preguntas
    
     gamification/                # Feature: Gamificación
        index.js                 # Exports
        pages/
           index.js             # Exports
           GamificationPage.jsx # Página de gamificación
        components/
            index.js             # Exports
            GamificationHub.jsx  # Hub de gamificación
            AdvancedGamificationHub.jsx # Hub avanzado
            DailyChallengesWidget.jsx # Widget de desafíos diarios
    
     learning/                    # Feature: Aprendizaje
        index.js                 # Exports
        pages/
           index.js             # Exports
           LearningPage.jsx     # Página de aprendizaje
           LearningRoadmapPage.jsx # Hoja de ruta
           ProgressiveICFESMapPage.jsx # Mapa progresivo
        components/
           index.js             # Exports
           LearningFilters.jsx  # Filtros de aprendizaje
           MaterialsGrid.jsx    # Grid de materiales
           AdditionalResources.jsx # Recursos adicionales
           LearningPathMap.jsx  # Mapa de ruta
           LearningRoadmap.jsx  # Hoja de ruta visual
           ProgressiveICFESMap.jsx # Mapa ICFES progresivo
        lessons/                 # Lecciones por área
            mathematics/         # Matemáticas
               Algebra.jsx
               Geometria.jsx
               Calculo.jsx
               Trigonometria.jsx
               NumerosComplejos.jsx
            lenguaje/            # Lenguaje
               Gramatica.jsx
               Comprension.jsx
               Literatura.jsx
               Ortografia.jsx
               Semantica.jsx
            science/             # Ciencias Naturales
               Biologia.jsx
               Fisica.jsx
               Quimica.jsx
               Ecologia.jsx
               Termodinamica.jsx
            social/              # Ciencias Sociales
                Historia.jsx
                Geografia.jsx
                Economia.jsx
                Ciudadania.jsx
                Filosofia.jsx
    
     progress/                    # Feature: Seguimiento de progreso
        index.js                 # Exports
        pages/                   # (Vacío)
        components/              # (Vacío)
    
     store/                       # Feature: Tienda de recompensas
        index.js                 # Exports
        pages/
           index.js             # Exports
           StorePage.jsx        # Página de tienda
        components/
            index.js             # Exports
            BadgesStore.jsx      # Tienda de insignias
    
     user/                        # Feature: Perfil de usuario
         index.js                 # Exports
         pages/
            index.js             # Exports
            UserProfilePage.jsx  # Perfil del usuario
            UserSettingsPage.jsx # Configuración del usuario
         components/
             index.js             # Exports
             HeaderWithAuth.jsx   # Header con autenticación
```

---

##  Descripción de Capas

### 1. **Core** (`/core`)
Lógica central y datos compartidos:
- **Constantes**: Información sobre áreas de estudio
- **Datos**: Material de aprendizaje, preguntas base
- No depende de componentes React

### 2. **Services** (`/services`)
Lógica de negocio y comunicación con APIs:
- Base para otros servicios
- Integración con Firestore
- Manejo de exámenes, usuarios, gamificación y progreso

### 3. **Hooks** (`/hooks`)
Lógica reutilizable con React:
- Integración con servicios
- State management
- Efectos secundarios (animaciones, datos en tiempo real)

### 4. **Context** (`/context`)
Estado global:
- Autenticación (usuario actual, login/logout)
- Disponible en toda la aplicación

### 5. **Features** (`/features`)
Características aisladas con su propia lógica:
- Cada feature es independiente
- Contiene: pages, components, (y opcionalmente: hooks, services)
- **Estructura estándar**:
  ```
  feature/
   index.js          (re-exports pages y components)
   pages/
      index.js      (re-exports de páginas)
      PageName.jsx
   components/
       index.js      (re-exports de componentes)
       ComponentName.jsx
  ```

### 6. **Shared** (`/shared`)
Código compartido entre features:
- Componentes reutilizables globales
- Utilidades compartidas

### 7. **Config** (`/config`)
Configuraciones globales:
- Firebase
- APIs externas

### 8. **Styles** (`/styles`)
Estilos globales:
- Animaciones
- Variables CSS compartidas

---

##  Flujo de Importaciones

###  Importaciones Recomendadas

```javascript
// Feature-based imports (preferred)
import { HomePage } from '@/features/home/pages';
import { DonationSection } from '@/features/home/components';

// Shared components
import { Header } from '@/shared/components/Header';

// Core data
import { areaInfo } from '@/core/constants';
import { questions } from '@/core/data';

// Hooks
import { useExam } from '@/hooks';

// Services
import ExamService from '@/services/ExamService';

// Context
import { useAuth } from '@/context/AuthContext';

// Config
import { auth, db } from '@/config/firebase';
```

###  Importaciones a Evitar

```javascript
// No usar importaciones relativas largas
import HomePage from '../../../features/home/pages/HomePage.jsx';

// No importar componentes de otra feature directamente
import SomeComponent from '@/features/exam/components/SomeComponent';
```

---

##  Features Principales

| Feature | Propósito | Páginas | Componentes |
|---------|-----------|---------|-------------|
| **home** | Página inicial | HomePage | DonationSection |
| **auth** | Autenticación | Login, Signup, ForgotPassword, Onboarding | - |
| **exam** | Exámenes y práctica | Practice, FullExam, Clasificatoria | ExamConfigModal, AnswerSheet, ResultsAnalysis, QuestionPanel |
| **gamification** | Sistema de recompensas | GamificationPage | GamificationHub, DailyChallengesWidget |
| **learning** | Contenido educativo | LearningPage, Roadmap, ICFESMap | LearningFilters, MaterialsGrid, LessonsSubfeature |
| **progress** | Seguimiento | - | - |
| **store** | Tienda de insignias | StorePage | BadgesStore |
| **user** | Perfil y configuración | UserProfile, UserSettings | HeaderWithAuth |

---

##  Lessons (Subestructura)

Las lecciones se organizan por área temática:

```
learning/lessons/
 mathematics/    (Álgebra, Geometría, Cálculo, Trigonometría, Números Complejos)
 lenguaje/       (Gramática, Comprensión, Literatura, Ortografía, Semántica)
 science/        (Biología, Física, Química, Ecología, Termodinámica)
 social/         (Historia, Geografía, Economía, Ciudadanía, Filosofía)
```

---

##  Rutas Principales

| Ruta | Componente | Tipo | Requiere Auth |
|------|-----------|------|---------------|
| `/` | HomePage | Pública | No |
| `/login` | LoginPage | Pública | No |
| `/signup` | SignupPage | Pública | No |
| `/forgot-password` | ForgotPasswordPage | Pública | No |
| `/bienvenida` | OnboardingPage | Privada | Sí |
| `/gamificacion` | GamificationPage | Privada | Sí |
| `/logros` | LogrosPage | Privada | Sí |
| `/ruta-aprendizaje` | LearningRoadmapPage | Demo | - |
| `/mapa-icfes` | ProgressiveICFESMapPage | Privada | Sí |
| `/desafios-diarios` | DailyChallengesPage | Privada | Sí |
| `/practica/:area` | PracticePage | Privada | Sí |
| `/aprendizaje` | LearningPage | Privada | Sí |
| `/tienda` | StorePage | Privada | Sí |
| `/perfil` | UserProfilePage | Privada | Sí |
| `/configuracion` | UserSettingsPage | Privada | Sí |
| `/examen-completo` | FullExamPage | Privada | Sí |
| `/lessons/:area/:lesson` | LessonComponent | Pública | No |

---

##  Integración con Firebase

```
Firebase Services (Firestore + Auth)
         ↓
    Services Layer
     UserFirestoreService
     ExamFirestoreService
     GamificationFirestoreService
     ProgressFirestoreService
         ↓
    Hooks Layer
     useUserDataFirestore
     useExamFirestore
     useGamificationFirestore
     useProgressFirestore
         ↓
    Context/Components (UI)
     AuthContext + Features
```

---

##  Próximas Mejoras Sugeridas

1. **Organización de Hooks**: Mover hooks específicos de features a sus carpetas
2. **Hooks Compartidos**: Centralizar en `/shared/hooks`
3. **Services Compartidos**: Crear `/shared/services` para lógica común
4. **Tipos TypeScript**: Agregar tipos si se migra a TypeScript
5. **Componentes Atómicos**: Crear `/shared/components/atoms` para componentes base

---

##  Notas Importantes

-  Usa alias `@/` para todas las importaciones
-  Cada feature es independiente
-  Re-exports en `index.js` facilitan las importaciones
-  Los servicios manejan la lógica de negocio
-  Los hooks exponen servicios a React
-  El contexto maneja estado global crítico

---

**Última actualización**: 13 de diciembre de 2025
**Versión**: 1.0
