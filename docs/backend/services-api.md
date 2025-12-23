# Arquitectura de Servicios y Data Layer

##  Visión General

La aplicación ICFES utiliza una **arquitectura desacoplada de tres capas** que permite cambiar entre localStorage (desarrollo) y API (producción) sin modificar los componentes:

```

         React Components                 
     (UserProfilePage, ExamPage, etc)     

              

       Custom Hooks (useUserData)         
   (Abstracción de lógica de datos)       

              

    Services (UserService, etc)           
  (Lógica de negocio y CRUD)              

              

   BaseService + api.config.js            
  (Capa de abstracción - localStorage     
   o API según MODE)                      

```

##  Componentes Principales

### 1. **api.config.js** (Configuración Central)
- **Ubicación**: `src/services/api.config.js`
- **Propósito**: Centraliza toda la configuración de modo (localStorage/API)
- **Variables de Entorno**:
  ```
  REACT_APP_API_MODE=localStorage    # 'localStorage' o 'api'
  REACT_APP_API_URL=http://localhost:3001/api
  REACT_APP_API_TOKEN=your_token_here
  ```

### 2. **BaseService.js** (Clase Abstracta)
- **Ubicación**: `src/services/BaseService.js`
- **Responsabilidad**: Proporciona operaciones CRUD genéricas
- **Métodos**:
  - `get(id?)` - Obtener uno o todos
  - `create(data)` - Crear nuevo registro
  - `update(id, data)` - Actualizar existente
  - `delete(id)` - Eliminar registro

**Ejemplo de Uso Interno**:
```javascript
class UserService extends BaseService {
  constructor() {
    super('user'); // 'user' = nombreRecurso
  }
}
```

### 3. **Servicios Especializados**

#### **UserService.js**
Gestiona datos de usuario, perfil y configuración
```javascript
// Métodos principales
await UserService.getUserProfile()
await UserService.updateProfile(userId, data)
await UserService.updateUsername(userId, name)
await UserService.getSettings(userId)
await UserService.exportUserData(userId)
await UserService.deleteAccount(userId)
```

#### **ProgressService.js**
Gestiona estadísticas, progreso y recomendaciones
```javascript
// Métodos principales
await ProgressService.getUserStats(userId)
await ProgressService.updateAfterAnswer(userId, answerData)
await ProgressService.getAreaStats(userId, area)
await ProgressService.getRecommendations(userId)
await ProgressService.updateDailyStreak(userId)
```

#### **GamificationService.js**
Gestiona gamificación: XP, monedas, badges y niveles
```javascript
// Métodos principales
await GamificationService.addXP(userId, points, reason)
await GamificationService.addCoins(userId, amount, reason)
await GamificationService.unlockBadge(userId, badgeId)
await GamificationService.getLevel(userId)
await GamificationService.getLeaderboard()

// Constantes
GamificationService.BADGES      // Definición de todos los badges
GamificationService.LEVELS      // Definición de niveles
```

#### **ExamService.js**
Gestiona exámenes, cuestionarios y análisis de resultados
```javascript
// Métodos principales
await ExamService.createExam(userId, examData)
await ExamService.saveAnswer(examId, answerData)
await ExamService.completeExam(examId)
await ExamService.getUserExams(userId, filters)
await ExamService.getExamAnalysis(examId)
await ExamService.getWrongAnswers(examId)
```

### 4. **Custom Hooks** (Abstracción de Servicios)
Proporcionan una interfaz React-friendly para los servicios

#### **useUserData()**
```javascript
const { user, loading, updateProfile, exportData } = useUserData();
```

#### **useProgress(userId)**
```javascript
const { stats, recommendations, updateAfterAnswer } = useProgress(userId);
```

#### **useGamification(userId)**
```javascript
const { level, coins, badges, addXP, unlockBadge } = useGamification(userId);
```

#### **useExam(examId)**
```javascript
const { exam, analysis, saveAnswer, completeExam } = useExam(examId);
```

##  Flujo de Datos

### Ejemplo: Actualizar Perfil de Usuario

```
1. Component:
   <button onClick={() => updateUsername('newName')}>

2. Hook (useUserData):
   const updateUsername = async (username) => {
     const updated = await UserService.updateProfile(user.id, { username });
     setUser(updated);
   }

3. Service (UserService):
   updateProfile(userId, data) {
     return this.update(userId, data);
   }

4. BaseService:
   update(id, data) {
     if (MODE === 'localStorage') {
       return this._updateInLocalStorage(id, data);
     } else {
       return this._updateInAPI(id, data);
     }
   }

5. Resultado: localStorage actualizado sin cambiar componentes
```

### Ejemplo: Responder una Pregunta

```javascript
// En ExamPage component
const { saveAnswer } = useExam(examId);
const { updateAfterAnswer } = useProgress(userId);

const handleAnswer = async (questionId, selectedAnswer) => {
  // 1. Guardar respuesta en examen
  await saveAnswer(questionId, selectedAnswer, correctAnswer, isCorrect, timeSpent);
  
  // 2. Actualizar estadísticas de progreso
  await updateAfterAnswer({
    isCorrect,
    area: question.area,
    difficulty: question.difficulty,
    timeSpent
  });
  
  // 3. Verificar y desbloquear badges
  const unlockedBadges = await checkAndUnlockAchievements(context);
  
  // Todo sucede automáticamente:
  // - Se guarda en localStorage
  // - Se calculan estadísticas
  // - Se actualizan los UI en tiempo real
};
```

##  Estructura de Datos en localStorage

```javascript
// USUARIO
localStorage.icfes_user = [{
  id: "user_1704067200000_0.123",
  username: "Juan Pérez",
  email: "juan@email.com",
  profileImage: "data:image/png;base64,...",
  personalPhrase: "Mi frase motivadora",
  settings: { notifications: true, darkMode: true },
  createdAt: "2024-01-01T...",
  updatedAt: "2024-01-05T..."
}]

// PROGRESO
localStorage.icfes_progress = [{
  id: "user_1704067200000_0.123",
  userId: "user_1704067200000_0.123",
  totalQuestionsAnswered: 150,
  correctAnswers: 120,
  currentStreak: 5,
  areaStats: {
    "Lenguaje": { questionsAnswered: 50, correctAnswers: 40, percentage: 80 },
    "Matemáticas": { questionsAnswered: 100, correctAnswers: 80, percentage: 80 }
  }
}]

// GAMIFICACIÓN
localStorage.icfes_gamification = [{
  id: "user_1704067200000_0.123",
  userId: "user_1704067200000_0.123",
  level: 3,
  totalXP: 450,
  totalCoins: 250,
  spentCoins: 100,
  badges: [
    { id: "first_question", name: "Primer Paso", unlockedAt: "2024-01-01T..." }
  ]
}]

// EXÁMENES
localStorage.icfes_exam = [{
  id: "exam_1704067200000_0.456",
  userId: "user_1704067200000_0.123",
  type: "practice",
  totalQuestions: 20,
  score: 85,
  status: "completed",
  answers: [
    { questionId: "q1", selectedAnswer: "B", correctAnswer: "B", isCorrect: true }
  ],
  completedAt: "2024-01-05T..."
}]
```

##  Migración a Backend: Paso a Paso

### Paso 1: Crear API Backend
El backend debe implementar los mismos endpoints que BaseService espera:

```
POST   /api/user              # create
GET    /api/user              # get all
GET    /api/user/:id          # get one
PUT    /api/user/:id          # update
DELETE /api/user/:id          # delete

POST   /api/progress          # create
GET    /api/progress          # get all
GET    /api/progress/:id      # get one
PUT    /api/progress/:id      # update
DELETE /api/progress/:id      # delete

POST   /api/gamification      # create
GET    /api/gamification      # get all
GET    /api/gamification/:id  # get one
PUT    /api/gamification/:id  # update
DELETE /api/gamification/:id  # delete

POST   /api/exam              # create
GET    /api/exam              # get all
GET    /api/exam/:id          # get one
PUT    /api/exam/:id          # update
DELETE /api/exam/:id          # delete
```

### Paso 2: Cambiar Configuración
Simplemente cambiar la variable de entorno:

```bash
# .env.production
REACT_APP_API_MODE=api
REACT_APP_API_URL=https://tudominio.com/api
REACT_APP_API_TOKEN=your_jwt_token
```

**¡Eso es todo!** Los servicios automáticamente usarán la API en lugar de localStorage.

### Paso 3: Autenticación
Cuando implementes autenticación:

```javascript
// En BaseService._fetchWithAuth():
if (API_CONFIG.API_TOKEN) {
  options.headers['Authorization'] = `Bearer ${API_CONFIG.API_TOKEN}`;
}
```

##  Implementación de Nuevos Servicios

Si necesitas un nuevo servicio (ej: NotificationsService):

```javascript
// 1. Crear archivo src/services/NotificationsService.js
import BaseService from './BaseService';

class NotificationsService extends BaseService {
  constructor() {
    super('notification'); // Este es el nombre del recurso en la API
  }

  async getUserNotifications(userId) {
    const notifications = await this.get();
    return notifications.filter(n => n.userId === userId);
  }
  
  // ... más métodos específicos
}

export default new NotificationsService();

// 2. Agregar al index.js
// src/services/index.js
export { NotificationsService } from './NotificationsService';

// 3. Crear un custom hook si lo necesita
// src/hooks/useNotifications.js
import { NotificationsService } from '@/services';

export function useNotifications(userId) {
  // ... hook logic
}

// 4. Usar en componentes
// En tu componente
import { useNotifications } from '@/hooks';
const { notifications } = useNotifications(userId);
```

##  Mejores Prácticas

###  DO's
-  Usar servicios para todas las operaciones de datos
-  Usar hooks en componentes funcionales
-  Mantener servicios sin conocimiento de React
-  Usar IDs de usuario para filtrar datos
-  Implementar manejo de errores en hooks

###  DON'Ts
-  Acceder directamente a localStorage desde componentes
-  Hacer lógica de negocio en componentes
-  Usar async/await sin try/catch
-  Guardar datos sensibles en localStorage sin encripción
-  Crear servicios sin extender BaseService

##  Seguridad

### localStorage (Desarrollo)
- No almacena datos sensibles (passwords, tokens)
- Los datos están en texto plano
- Usar solo para desarrollo local

### API (Producción)
- Implementar autenticación JWT
- Validación de token en cada request
- HTTPS obligatorio
- CORS configurado correctamente
- Rate limiting implementado

##  Monitoreo y Debugging

```javascript
// En src/utils/debugTools.js
export function logServiceCall(serviceName, method, data) {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[${serviceName}] ${method}:`, data);
  }
}

// Uso en servicios
async update(id, data) {
  logServiceCall('UserService', 'update', { id, data });
  return super.update(id, data);
}
```
