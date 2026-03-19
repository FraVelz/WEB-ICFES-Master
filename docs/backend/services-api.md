# Arquitectura de Servicios y Data Layer

## Visión General

La aplicación ICFES utiliza una **arquitectura desacoplada** que permite cambiar entre **Supabase** (producción), **localStorage** (desarrollo sin backend) y **API REST** (backend custom) sin modificar los componentes. El modo se controla mediante `NEXT_PUBLIC_API_MODE`.

```
         React Components
     (UserProfilePage, ExamPage, etc)

              ↓

       Custom Hooks
   (useUserData, useProgress, useGamification, useExam)

              ↓

    Services / Adaptadores
  (UserSupabaseService, GamificationServiceAdapter, etc)

              ↓

   api.config.js (MODE: supabase | localStorage | api)
              ↓
   ┌──────────┼──────────┐
   ↓          ↓          ↓
Supabase   localStorage   API REST
(PostgreSQL)  (utils)    (BaseService)
```

## Componentes Principales

### 1. **api.config.js** (Configuración Central)

- **Ubicación**: `src/services/api.config.js`
- **Propósito**: Centraliza el modo de persistencia de datos
- **Modos soportados**:
  - `supabase` (por defecto): PostgreSQL + Supabase Auth
  - `localStorage`: Desarrollo local sin backend
  - `api`: Backend REST custom

**Variables de Entorno** (Next.js usa prefijo `NEXT_PUBLIC_`):

```
NEXT_PUBLIC_API_MODE=supabase     # 'supabase' | 'localStorage' | 'api'
NEXT_PUBLIC_API_URL=http://localhost:3001/api   # Solo cuando MODE === 'api'
NEXT_PUBLIC_API_TOKEN=your_token_here          # Solo cuando MODE === 'api'
```

### 2. **BaseService.js** (Legacy - modo API/localStorage)

- **Ubicación**: `src/services/BaseService.js`
- **Uso**: Servicios que extienden BaseService cuando `MODE === 'api'` o `MODE === 'localStorage'`
- **Métodos**: `get(id?)`, `create(data)`, `update(id, data)`, `delete(id)`

### 3. **SupabaseService.js** (Clase base para Supabase)

- **Ubicación**: `src/services/SupabaseService.js`
- **Responsabilidad**: Operaciones CRUD con Supabase, mapeo snake_case ↔ camelCase
- **Métodos**: `get()`, `getByUserId()`, `create()`, `update()`, `delete()`

### 4. **Servicios Supabase** (`src/services/supabase/`)

Servicios que conectan directamente con tablas de PostgreSQL en Supabase:

| Servicio | Tabla | Descripción |
|----------|-------|-------------|
| **UserSupabaseService** | `users` | Perfil, username, bio, virtualMoney, profileImage |
| **ProgressSupabaseService** | `user_progress` | totalAttempts, totalCorrect, streakDays, areaStats |
| **GamificationSupabaseService** | `user_gamification` | XP, level, totalCoins, badges, achievements |
| **ExamSupabaseService** | `exam_results` | Exámenes completados, scores, respuestas |
| **LearningSupabaseService** | `learning_content` | Lecciones por área, quizzes |

### 5. **GamificationServiceAdapter**

- **Ubicación**: `src/services/GamificationServiceAdapter.js`
- **Propósito**: Adaptador que selecciona GamificationSupabaseService o GamificationLocalService según `API_CONFIG.MODE`
- **Métodos**: `addXP()`, `addCoins()`, `spendCoins()`, `getProfile()`

### 6. **Servicios por Feature** (`src/features/*/services/`)

| Feature | Servicio | Descripción |
|---------|----------|-------------|
| **user** | UserService | Extiende BaseService (legacy). useUserData usa UserSupabaseService o utils |
| **progress** | ProgressService | Extiende BaseService. useProgress usa ProgressSupabaseService o progressStorage |
| **logros** | GamificationService | Extiende BaseService. useGamification usa GamificationSupabaseService o localStorage |
| **logros** | AchievementService | Lógica de logros desbloqueables |
| **exam** | ExamService | Extiende BaseService. useExam usa ExamSupabaseService o progressStorage |
| **exam** | ExamDataService | Carga de preguntas |
| **exam** | TestResultService | Análisis de resultados |
| **learning** | LearningService | Supabase o roadmapData estático |
| **learning** | LearningMaterialService | Material de estudio |
| **store** | SubscriptionPlanService | Planes (localStorage por ahora) |
| **store** | PlanScheduleService | Verificación de planes |
| **auth** | AuthService | Verificación de códigos reset (local) |

## Custom Hooks

Los hooks abstraen la lógica y seleccionan el servicio según `API_CONFIG.MODE`:

### **useUserData()**

```javascript
const { user, loading, updateProfile, updateUsername, updateBio, updateProfileImage, addMoney, spendMoney, refresh } = useUserData();
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
const { achievements, totalXP, level, coins, currentStreak, updateAchievementProgress, refreshData } = useGamification(userId);
```

- **Supabase**: GamificationSupabaseService
- **localStorage**: localStorage (`icfes_gamification`, `icfes_streak_dates`)

### **useExam(examId)**

```javascript
const { exam, getUserExams, resetUserExams, refresh } = useExam(examId);
```

- **Supabase**: ExamSupabaseService
- **localStorage**: `getStoredExams()` de progressStorage

## Estructura de Tablas Supabase

### `users`

| Columna | Tipo | Descripción |
|---------|------|-------------|
| id | uuid | ID del usuario (Supabase Auth) |
| email | text | Email |
| display_name | text | Nombre mostrado |
| username | text | Nombre de usuario |
| bio | text | Biografía |
| profile_image | text | URL o base64 de foto |
| virtual_money | int | Monedas virtuales |
| created_at | timestamptz | Fecha creación |
| updated_at | timestamptz | Fecha actualización |

### `user_progress`

| Columna | Tipo | Descripción |
|---------|------|-------------|
| user_id | uuid | FK a users |
| total_attempts | int | Intentos totales |
| total_correct | int | Respuestas correctas |
| percentage | float | Porcentaje |
| streak_days | int | Días de racha |
| area_stats | jsonb | Estadísticas por área |
| last_activity_date | date | Última actividad |

### `user_gamification`

| Columna | Tipo | Descripción |
|---------|------|-------------|
| user_id | uuid | FK a users |
| xp / total_xp | int | Experiencia total |
| level | int | Nivel actual |
| total_coins | int | Monedas ganadas |
| spent_coins | int | Monedas gastadas |
| badges | jsonb | Badges desbloqueados |
| achievements | jsonb | Progreso de logros |
| xp_history | jsonb | Historial XP |
| coins_history | jsonb | Historial monedas |

### `exam_results`

| Columna | Tipo | Descripción |
|---------|------|-------------|
| id | text | ID del examen |
| user_id | uuid | FK a users |
| exam_type | text | practice | full |
| score | int | Puntaje |
| correct_answers | int | Respuestas correctas |
| total_questions | int | Total preguntas |
| time_spent | int | Tiempo en segundos |
| completed_at | timestamptz | Fecha completado |
| questions | jsonb | Respuestas guardadas |

### `learning_content`

| Columna | Tipo | Descripción |
|---------|------|-------------|
| id | uuid | ID |
| area | text | matematicas, lectura_critica, etc |
| order_index | int | Orden de lecciones |
| content | jsonb | Contenido (title, summary, questions, quiz) |
| published | bool | Publicado |

## Flujo de Datos

### Ejemplo: Actualizar perfil (Supabase)

```
1. Component: <button onClick={() => updateProfile({ username: 'nuevo' })}>
2. Hook (useUserData): Llama UserSupabaseService.updateProfile(user.uid, updates)
3. UserSupabaseService: supabase.from('users').update(...).eq('id', userId)
4. Resultado: PostgreSQL actualizado
```

### Ejemplo: Añadir XP (GamificationServiceAdapter)

```javascript
import GamificationServiceAdapter from '@/services/GamificationServiceAdapter';

// El adaptador selecciona automáticamente Supabase o Local
await GamificationServiceAdapter.addXP(userId, 50, 'pregunta_correcta');
```

## Migración entre modos

### Cambiar a Supabase (producción)

```bash
# .env.local
NEXT_PUBLIC_API_MODE=supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
```

### Cambiar a localStorage (desarrollo)

```bash
NEXT_PUBLIC_API_MODE=localStorage
```

### Cambiar a API REST (backend custom)

```bash
NEXT_PUBLIC_API_MODE=api
NEXT_PUBLIC_API_URL=https://tudominio.com/api
NEXT_PUBLIC_API_TOKEN=your_jwt_token
```

Los servicios que usan BaseService (UserService, ProgressService, GamificationService, ExamService) funcionarán con API REST si implementas los endpoints CRUD estándar.

## Exportaciones desde `@/services`

```javascript
import {
  UserService,
  ProgressService,
  GamificationService,
  ExamService,
  BaseService,
  SubscriptionPlanService,
  PlanScheduleService,
  ExamDataService,
  LearningMaterialService,
  AchievementService,
  TestResultService,
  BADGES,
  LEVELS
} from '@/services';

import GamificationServiceAdapter from '@/services/GamificationServiceAdapter';
```

## Mejores Prácticas

### DO's

- Usar hooks en componentes (useUserData, useProgress, etc)
- Usar GamificationServiceAdapter para XP/monedas
- Consultar `API_CONFIG.MODE` solo en servicios/hooks, no en componentes
- Mantener servicios sin conocimiento de React

### DON'Ts

- Acceder directamente a localStorage desde componentes
- Usar UserService/ProgressService directamente si existe hook equivalente (preferir useUserData, useProgress)
- Hardcodear el modo de API en componentes

## Seguridad

### Supabase (Producción)

- Row Level Security (RLS) en tablas
- Autenticación con Supabase Auth (JWT)
- Anon key solo para operaciones permitidas

### localStorage (Desarrollo)

- No almacenar tokens ni datos sensibles
- Usar solo para desarrollo local

### API REST

- JWT en header Authorization
- HTTPS obligatorio
- Validación de token en cada request

## Monitoreo y Debugging

```javascript
// Ver modo actual
import API_CONFIG from '@/services/api.config';
console.log('Modo:', API_CONFIG.MODE);
```

---

Última actualización: Marzo 2026
