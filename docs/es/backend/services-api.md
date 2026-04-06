# Arquitectura de Servicios, Data Layer y Módulo de Aprendizaje

Documento unificado que describe la arquitectura de servicios, la capa de datos y la estructura de lecciones/quizzes del módulo de aprendizaje.

## Temario

- [Visión General](#visión-general)
- [Componentes Principales](#componentes-principales)
- [Custom Hooks](#custom-hooks)
- [Estructura de Tablas Supabase](#estructura-de-tablas-supabase)
- [Módulo de Aprendizaje y Quizzes](#módulo-de-aprendizaje-y-quizzes)
- [Flujo de Datos](#flujo-de-datos)
- [Migración entre modos](#migración-entre-modos)
- [Exportaciones desde `@/services`](#exportaciones-desde-services)

---

## Visión General

La aplicación ICFES utiliza una **arquitectura desacoplada** que permite cambiar entre **Supabase** (producción) y **localStorage** (desarrollo sin backend) sin modificar los componentes. El modo se controla mediante `NEXT_PUBLIC_API_MODE`.

```txt
         React Components
     (UserProfilePage, ExamPage, LearningRoadmap, etc)

              ↓

       Custom Hooks
   (useUserData, useProgress, useGamification, useExam)

              ↓

    Services / Adaptadores
  (UserSupabaseService, GamificationServiceAdapter, LearningService, etc)

              ↓

   api.config.js (MODE: supabase | localStorage)
              ↓
   ┌──────────┴──────────┐
   ↓                     ↓
Supabase              localStorage / roadmapData
(PostgreSQL)            (utils, datos estáticos)
```

---

## Componentes Principales

### 1. **api.config.js** (Configuración Central)

- **Ubicación**: `src/services/api.config.js`
- **Propósito**: Centraliza el modo de persistencia de datos
- **Modos soportados**:
  - `supabase` (por defecto): PostgreSQL + Supabase Auth
  - `localStorage`: Desarrollo local sin backend

**Variables de Entorno** (Next.js usa prefijo `NEXT_PUBLIC_`):

```txt
NEXT_PUBLIC_API_MODE=supabase     # 'supabase' | 'localStorage'
```

### 2. **Capa legacy eliminada**

Las clases genéricas `BaseService` y `SupabaseService` en `src/services/` se retiraron: la app usa `@/services/persistence` y los `*SupabaseService` concretos.

### 3. **Servicios Supabase** (`src/services/supabase/`)

Servicios que conectan directamente con tablas de PostgreSQL en Supabase:

| Servicio                        | Tabla               | Descripción                                        |
| ------------------------------- | ------------------- | -------------------------------------------------- |
| **UserSupabaseService**         | `users`             | Perfil, username, bio, virtualMoney, profileImage  |
| **ProgressSupabaseService**     | `user_progress`     | totalAttempts, totalCorrect, streakDays, areaStats |
| **GamificationSupabaseService** | `user_gamification` | XP, level, totalCoins, badges, achievements        |
| **ExamSupabaseService**         | `exam_results`      | Exámenes completados, scores, respuestas           |
| **LearningSupabaseService**     | `learning_content`  | Lecciones por área, contenido, quizzes             |

### 4. **GamificationServiceAdapter**

- **Ubicación**: `src/services/GamificationServiceAdapter.js`
- **Propósito**: Adaptador que selecciona GamificationSupabaseService o GamificationLocalService según `API_CONFIG.MODE`
- **Métodos**: `addXP()`, `addCoins()`, `spendCoins()`, `getProfile()`

### 5. **Servicios por Feature** (`src/features/*/services/`)

| Feature      | Servicio                | Descripción                                                                          |
| ------------ | ----------------------- | ------------------------------------------------------------------------------------ |
| **user**     | UserService             | useUserData usa UserSupabaseService o utils                                          |
| **progress** | ProgressService         | useProgress usa ProgressSupabaseService o progressStorage                            |
| **logros**   | GamificationService     | useGamification usa GamificationSupabaseService o localStorage                        |
| **exam**     | ExamService             | useExam usa ExamSupabaseService o progressStorage                                    |
| **learning** | LearningService         | Supabase o roadmapData estático (`learning_content` vía LearningSupabaseService)     |
| **store**    | SubscriptionPlanService | Planes (localStorage por ahora)                                                      |
| **store**    | PlanScheduleService     | Verificación de planes                                                               |
| **auth**     | AuthService             | Verificación de códigos reset (local)                                                |

---

## Custom Hooks

Los hooks abstraen la lógica y seleccionan el servicio según `API_CONFIG.MODE`:

### **useUserData()**

```javascript
const { user, loading, updateProfile, updateUsername, updateBio, updateProfileImage, addMoney, spendMoney, refresh } =
  useUserData();
```

- **Supabase**: UserSupabaseService
- **localStorage**: `@/shared/utils/userProfile`

### **useProgress()**

```javascript
const { progress, areaStats, recommendations, attemptHistory, resetProgress, refresh } = useProgress();
```

- **Supabase**: ProgressSupabaseService
- **localStorage**: `@/shared/utils/progressStorage`

### **useGamification(userId)**

```javascript
const { achievements, totalXP, level, coins, currentStreak, updateAchievementProgress, refreshData } =
  useGamification(userId);
```

- **Supabase**: GamificationSupabaseService
- **localStorage**: localStorage (`icfes_gamification`, `icfes_streak_dates`)

### **useExam(examId)**

```javascript
const { exam, getUserExams, resetUserExams, refresh } = useExam(examId);
```

- **Supabase**: ExamSupabaseService
- **localStorage**: `getStoredExams()` de progressStorage

---

## Estructura de Tablas Supabase

### `users`

| Columna       | Tipo        | Descripción                    |
| ------------- | ----------- | ------------------------------ |
| id            | uuid        | ID del usuario (Supabase Auth) |
| email         | text        | Email                          |
| display_name  | text        | Nombre mostrado                |
| username      | text        | Nombre de usuario              |
| bio           | text        | Biografía                      |
| profile_image | text        | URL o base64 de foto           |
| virtual_money | int         | Monedas virtuales              |
| created_at    | timestamptz | Fecha creación                 |
| updated_at    | timestamptz | Fecha actualización            |

### `user_progress`

| Columna            | Tipo  | Descripción           |
| ------------------ | ----- | --------------------- |
| user_id            | uuid  | FK a users            |
| total_attempts     | int   | Intentos totales      |
| total_correct      | int   | Respuestas correctas  |
| percentage         | float | Porcentaje            |
| streak_days        | int   | Días de racha         |
| area_stats         | jsonb | Estadísticas por área |
| last_activity_date | date  | Última actividad      |

### `user_gamification`

| Columna       | Tipo  | Descripción          |
| ------------- | ----- | -------------------- |
| user_id       | uuid  | FK a users           |
| xp / total_xp | int   | Experiencia total    |
| level         | int   | Nivel actual         |
| total_coins   | int   | Monedas ganadas      |
| spent_coins   | int   | Monedas gastadas     |
| badges        | jsonb | Badges desbloqueados |
| achievements  | jsonb | Progreso de logros   |
| xp_history    | jsonb | Historial XP         |
| coins_history | jsonb | Historial monedas    |

### `exam_results`

| Columna         | Tipo        | Descripción          |
| --------------- | ----------- | -------------------- |
| id              | text        | ID del examen        |
| user_id         | uuid        | FK a users           |
| exam_type       | text        | practice             |
| score           | int         | Puntaje              |
| correct_answers | int         | Respuestas correctas |
| total_questions | int         | Total preguntas      |
| time_spent      | int         | Tiempo en segundos   |
| completed_at    | timestamptz | Fecha completado     |
| questions       | jsonb       | Respuestas guardadas |

### `learning_content`

| Columna     | Tipo  | Descripción                                                                        |
| ----------- | ----- | ---------------------------------------------------------------------------------- |
| id          | uuid  | ID único (auto-generado)                                                           |
| area        | text  | Área: `matematicas`, `lectura_critica`, `sociales`, `ciencias_naturales`, `ingles` |
| order_index | int   | Orden de lecciones (1, 2, 3...)                                                    |
| published   | bool  | `true` para mostrar, `false` para ocultar                                          |
| content     | jsonb | Contenido (title, summary, body, questions, quiz)                                  |

**Mapeo de áreas** (app → BD):

| Área en la App (ID)   | Valor en BD          |
| --------------------- | -------------------- |
| `lectura-critica`     | `lectura_critica`    |
| `matematicas`         | `matematicas`        |
| `sociales-ciudadanas` | `sociales`           |
| `ciencias-naturales`  | `ciencias_naturales` |
| `ingles`              | `ingles`             |

---

## Módulo de Aprendizaje y Quizzes

### Flujo de datos del aprendizaje

1. **LearningService.getLearningPath(areaId)** consulta lecciones según `API_CONFIG.MODE`:
   - **Supabase**: `LearningSupabaseService.getLessonsByArea(area)` → tabla `learning_content`
   - **localStorage**: `roadmapData` estático (`BASICO_TOPICS`, `INTERMEDIO_TOPICS`)

2. Las lecciones se ordenan por `order_index` y solo se muestran con `published: true`.

3. **Progreso de lecciones completadas**: se guarda en **localStorage** (`progressStorage`) independientemente del modo API. Clave: `icfes_completed_lessons`.

### Estructura del objeto `content` (JSONB en `learning_content`)

```json
{
  "title": "Título de la Lección",
  "summary": "Breve descripción del contenido.",
  "body": "# Contenido en Markdown\n\nTexto de la lección...",
  "type": "lesson",
  "questions": [],
  "quiz": {}
}
```

| Campo     | Tipo   | Obligatorio | Descripción                                            |
| --------- | ------ | ----------- | ------------------------------------------------------ |
| title     | string | Sí          | Título visible de la lección                           |
| summary   | string | No          | Breve descripción                                      |
| body      | string | No          | Contenido en Markdown (se renderiza con ReactMarkdown) |
| type      | string | No          | `lesson` por defecto                                   |
| questions | array  | No          | Preguntas del quiz (formato 1, ver abajo)              |
| quiz      | object | No          | Quiz asociado (formatos 2 o 3, ver abajo)              |

### Formatos de quiz soportados

El componente `LessonQuizModal` acepta **tres formatos** (prioridad de uso):

#### Formato 1: Array `questions` directo

```json
{
  "title": "Introducción a la Lectura Crítica",
  "questions": [
    {
      "id": "q1",
      "question": "¿Cuál es la intención del autor?",
      "options": [
        { "id": "a", "text": "Opción A" },
        { "id": "b", "text": "Opción B (correcta)" }
      ],
      "correctAnswer": "b",
      "explanation": "Explicación opcional"
    }
  ]
}
```

#### Formato 2: `quiz.questions` (array dentro del quiz)

```json
{
  "quiz": {
    "title": "Prueba de conceptos",
    "rewards": { "xp": 50, "coins": 25 },
    "questions": [
      {
        "question": "Pregunta principal",
        "options": ["Opción A", "Opción B", "Opción C"],
        "correct_answer": 1
      }
    ]
  }
}
```

#### Formato 3: Quiz único (formato legacy)

```json
{
  "quiz": {
    "title": "Evaluación Rápida",
    "question": "¿Cuál es la pregunta principal?",
    "options": [
      { "id": "a", "text": "Opción A" },
      { "id": "b", "text": "Opción B (correcta)" }
    ],
    "correctAnswer": "b",
    "rewards": { "xp": 50, "coins": 20 }
  }
}
```

### Campos de preguntas y opciones

| Campo          | Tipo   | Descripción                                  |
| -------------- | ------ | -------------------------------------------- |
| question       | string | Texto de la pregunta (también acepta `text`) |
| options        | array  | Opciones: `{id, text}` o array de strings    |
| correctAnswer  | string | ID de la opción correcta (a, b, c, d)        |
| correct_answer | number | Índice de la opción correcta (0, 1, 2...)    |
| explanation    | string | Explicación opcional tras responder          |

Las opciones se normalizan automáticamente: si son strings, se asignan ids `a`, `b`, `c`, `d`.

### Recompensas (XP y monedas)

**Prioridad** para determinar XP y monedas al completar una lección:

1. `lessonXp` / `lessonCoins` (props del componente)
2. `quiz.rewards.xp` / `quiz.rewards.coins`
3. **Valores por defecto**: 500 XP, 250 monedas

Solo se otorgan recompensas **una vez** por lección (se verifica con `getCompletedLessons()`).

### Flujo de recompensas

1. El usuario responde todas las preguntas del quiz en `LessonQuizModal`.
2. Se valida que todas las respuestas sean correctas.
3. Si es la primera vez que completa la lección y hay usuario autenticado:
   - `GamificationServiceAdapter.addXP()` y `addCoins()`
   - `markLessonAsCompleted()` en `progressStorage` (localStorage)
4. Se muestra feedback (Correcto/Incorrecto) y las recompensas ganadas.

---

## Flujo de Datos

### Ejemplo: Actualizar perfil (Supabase)

```txt
1. Component: <button onClick={() => updateProfile({ username: 'nuevo' })}>
2. Hook (useUserData): Llama UserSupabaseService.updateProfile(user.uid, updates)
3. UserSupabaseService: supabase.from('users').update(...).eq('id', userId)
4. Resultado: PostgreSQL actualizado
```

### Ejemplo: Añadir XP (GamificationServiceAdapter)

```javascript
import GamificationServiceAdapter from '@/services/GamificationServiceAdapter';

await GamificationServiceAdapter.addXP(userId, 50, 'lesson_quiz_lessonId');
```

### Ejemplo: Completar lección y ganar recompensas

```txt
1. Usuario completa quiz en LessonQuizModal
2. LessonQuizModal: GamificationServiceAdapter.addXP/addCoins
3. LessonQuizModal: markLessonAsCompleted(userId, lessonId) → progressStorage (localStorage)
4. Lección marcada como completada (no se vuelven a otorgar recompensas)
```

---

## Migración entre modos

### Cambiar a Supabase (producción)

```bash
# .env
NEXT_PUBLIC_API_MODE=supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
```

### Cambiar a localStorage (desarrollo)

```bash
NEXT_PUBLIC_API_MODE=localStorage
```

---

## Exportaciones desde `@/services`

```javascript
import {
  SubscriptionPlanService,
  PlanScheduleService,
  BADGES,
  LEVELS,
} from '@/services';

import * as persistence from '@/services/persistence';

import GamificationServiceAdapter from '@/services/GamificationServiceAdapter';
```
