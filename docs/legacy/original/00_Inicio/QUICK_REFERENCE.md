#  Quick Reference - Servicios & Hooks

##  Índice Rápido

- [Servicios](#-servicios)
- [Hooks](#-hooks)
- [Ejemplos Rápidos](#-ejemplos-rápidos)
- [Variables de Entorno](#-variables-de-entorno)
- [Migración](#-migración)

---

##  Servicios

### UserService
**Ubicación**: `src/services/UserService.js`

```javascript
import { UserService } from '@/services';

// Obtener perfil actual
const user = await UserService.getUserProfile();

// Actualizar perfil completo
await UserService.updateProfile(userId, { username: 'Nuevo Nombre' });

// Actualizar campo específico
await UserService.updateUsername(userId, 'Nuevo Username');
await UserService.updatePersonalPhrase(userId, 'Mi nuevo lema');
await UserService.updateProfileImage(userId, base64String);

// Configuración
const settings = await UserService.getSettings(userId);
await UserService.updateSettings(userId, { notifications: false });

// Importar/Exportar
const backup = await UserService.exportUserData(userId);
await UserService.importUserData(userId, backup);

// Eliminar cuenta
await UserService.deleteAccount(userId);
```

---

### ProgressService
**Ubicación**: `src/services/ProgressService.js`

```javascript
import { ProgressService } from '@/services';

// Obtener estadísticas completas
const stats = await ProgressService.getUserStats(userId);
// { totalQuestionsAnswered, correctAnswers, currentStreak, areaStats, ... }

// Actualizar después de responder pregunta
await ProgressService.updateAfterAnswer(userId, {
  isCorrect: true,
  area: 'Lenguaje',
  difficulty: 'media',
  timeSpent: 45
});

// Estadísticas por área
const areaStats = await ProgressService.getAreaStats(userId, 'Lenguaje');
const allAreas = await ProgressService.getAllAreaStats(userId);

// Racha diaria
const streak = await ProgressService.getStreak(userId);
// { current, max, lastUpdated }

await ProgressService.updateDailyStreak(userId);

// Recomendaciones personalizadas
const recommendations = await ProgressService.getRecommendations(userId);
// [ { type: 'priority', area: '...', message: '...', icon: '' }, ... ]

// Análisis de desempeño
const analysis = await ProgressService.getPerformanceAnalysis(userId, 7);
```

---

### GamificationService
**Ubicación**: `src/services/GamificationService.js`

```javascript
import { GamificationService, BADGES, LEVELS } from '@/services';

// Obtener perfil de gamificación
const profile = await GamificationService.getProfile(userId);

// XP y Niveles
await GamificationService.addXP(userId, 50, 'Pregunta correcta');
const level = await GamificationService.getLevel(userId);
// { current: {level, title, icon}, next: {...}, totalXP, xpProgress }

// Monedas
await GamificationService.addCoins(userId, 10, 'Bonus');
await GamificationService.spendCoins(userId, 5, 'Tema desbloqueado');
const coins = await GamificationService.getCoinsInfo(userId);
// { total, available, spent }

// Badges
const badges = await GamificationService.getBadges(userId);
await GamificationService.unlockBadge(userId, 'first_question');
await GamificationService.checkAndUnlockAchievements(userId, {
  totalQuestionsAnswered: 100,
  streak: 7
});

// Leaderboard
const top10 = await GamificationService.getLeaderboard();
// [ { rank, userId, level, totalXP, badges }, ... ]

// Constantes disponibles
console.log(BADGES);   // Todos los badges predefinidos
console.log(LEVELS);   // Todos los niveles
```

---

### ExamService
**Ubicación**: `src/services/ExamService.js`

```javascript
import { ExamService } from '@/services';

// Crear examen
const exam = await ExamService.createExam(userId, {
  type: 'practice',           // 'practice', 'mock', 'diagnostic'
  area: 'Lenguaje',
  difficulty: 'media',
  questions: [...],           // Array de preguntas
  timeLimit: 30              // Minutos
});

// Guardar respuesta
await ExamService.saveAnswer(examId, {
  questionId: 'q1',
  selectedAnswer: 'B',
  correctAnswer: 'B',
  isCorrect: true,
  timeSpent: 45              // Segundos
});

// Completar examen
const completed = await ExamService.completeExam(examId);
// { score, grade, status: 'completed', ... }

// Abandonar
await ExamService.abandonExam(examId);

// Historial
const userExams = await ExamService.getUserExams(userId, {
  type: 'practice',
  area: 'Lenguaje',
  status: 'completed',
  limit: 10
});

// Análisis
const analysis = await ExamService.getExamAnalysis(examId);
// { score, accuracy, byArea: [...], byDifficulty: [...] }

// Respuestas incorrectas
const wrong = await ExamService.getWrongAnswers(examId);

// Comparar exámenes
const comparison = await ExamService.compareExams(exam1Id, exam2Id);
// { improvement, improvementPercent }

// Exportar
const json = await ExamService.exportResults(examId, 'json');
const csv = await ExamService.exportResults(examId, 'csv');
```

---

##  Hooks

### useUserData()
**Ubicación**: `src/hooks/useUserData.js`

```javascript
import { useUserData } from '@/hooks';

const {
  user,                      // Objeto con datos del usuario
  loading,                   // boolean
  error,                     // string  null
  updateProfile,             // (updates) => Promise
  updateUsername,            // (username) => Promise
  updatePersonalPhrase,      // (phrase) => Promise
  updateProfileImage,        // (base64) => Promise
  getSettings,               // () => Promise
  updateSettings,            // (settings) => Promise
  exportData,                // () => Promise
  importData,                // (backupData) => Promise
  deleteAccount,             // () => Promise
  reload                     // () => Promise
} = useUserData();
```

---

### useProgress(userId)
**Ubicación**: `src/hooks/useProgress.js`

```javascript
import { useProgress } from '@/hooks';

const {
  stats,                     // Estadísticas completas
  recommendations,           // Array de recomendaciones
  analysis,                  // Análisis de desempeño
  loading, error,
  updateAfterAnswer,         // ({isCorrect, area, difficulty}) => Promise
  getAreaStats,              // (area) => Promise
  getAllAreaStats,           // () => Promise
  getStreak,                 // () => Promise
  updateDailyStreak,         // () => Promise
  reset,                     // () => Promise
  reload                     // () => Promise
} = useProgress(userId);
```

---

### useGamification(userId)
**Ubicación**: `src/hooks/useGamification.js`

```javascript
import { useGamification } from '@/hooks';

const {
  profile,                   // Perfil completo de gamificación
  level,                     // { current, next, totalXP, xpProgress }
  coins,                     // { total, available, spent }
  badges,                    // Array de badges desbloqueados
  notification,              // { message, type, icon }  null
  loading, error,
  addXP,                     // (points, reason) => Promise
  addCoins,                  // (amount, reason) => Promise
  spendCoins,                // (amount, item) => Promise
  unlockBadge,               // (badgeId) => Promise
  checkAndUnlockAchievements,// (context) => Promise
  reset,                     // () => Promise
  reload                     // () => Promise
} = useGamification(userId);
```

---

### useExam(examId)
**Ubicación**: `src/hooks/useExam.js`

```javascript
import { useExam } from '@/hooks';

const {
  exam,                      // Datos del examen actual
  analysis,                  // Análisis de resultados
  wrongAnswers,              // Array de respuestas incorrectas
  loading, error,
  saveAnswer,                // (qId, selected, correct, isCorrect, time) => Promise
  completeExam,              // () => Promise
  abandonExam,               // () => Promise
  loadAnalysis,              // () => Promise
  loadWrongAnswers,          // () => Promise
  exportResults,             // (format) => Promise
  reload                     // () => Promise
} = useExam(examId);
```

---

##  Ejemplos Rápidos

### Actualizar perfil de usuario

```javascript
import { useUserData } from '@/hooks';

function MyProfile() {
  const { user, updateUsername } = useUserData();
  
  return (
    <button onClick={() => updateUsername('Juan Pérez')}>
      Mi perfil es: {user?.username}
    </button>
  );
}
```

### Responder una pregunta

```javascript
import { useProgress } from '@/hooks';

function QuestionPage({ userId, question }) {
  const { updateAfterAnswer } = useProgress(userId);
  
  const handleAnswer = async (selected) => {
    const isCorrect = selected === question.correct;
    await updateAfterAnswer({
      isCorrect,
      area: question.area,
      difficulty: question.difficulty
    });
  };
  
  return <button onClick={() => handleAnswer('A')}>Opción A</button>;
}
```

### Mostrar progreso

```javascript
import { useProgress } from '@/hooks';

function ProgressDashboard({ userId }) {
  const { stats, loading } = useProgress(userId);
  
  if (loading) return <div>Cargando...</div>;
  
  return (
    <div>
      <p>Preguntas: {stats?.totalQuestionsAnswered}</p>
      <p>Correctas: {stats?.correctAnswers}</p>
      <p>Racha: {stats?.currentStreak} días </p>
    </div>
  );
}
```

### Ganar XP

```javascript
import { useGamification } from '@/hooks';

function EarnXP({ userId }) {
  const { addXP, level } = useGamification(userId);
  
  return (
    <div>
      <p>Nivel: {level?.current.title}</p>
      <button onClick={() => addXP(50, 'pregunta correcta')}>
        +50 XP
      </button>
    </div>
  );
}
```

### Completar un examen

```javascript
import { useExam } from '@/hooks';

function ExamResults({ examId }) {
  const { completeExam, analysis } = useExam(examId);
  
  return (
    <div>
      <button onClick={completeExam}>Finalizar Examen</button>
      {analysis && <p>Tu puntuación: {analysis.score}%</p>}
    </div>
  );
}
```

---

##  Variables de Entorno

**Archivo**: `.env` o `.env.production`

```bash
# Modo de almacenamiento
REACT_APP_API_MODE=localStorage    # O 'api' para backend

# Solo si usas modo API
REACT_APP_API_URL=https://api.midominio.com
REACT_APP_API_TOKEN=tu_jwt_token_aqui

# Debug (opcional)
REACT_APP_DEBUG=true
```

---

##  Migración a Backend

### Paso 1: El backend debe tener estos endpoints

```
POST   /api/user                  # Create
GET    /api/user/:id              # Get
PUT    /api/user/:id              # Update
DELETE /api/user/:id              # Delete

POST   /api/progress
GET    /api/progress/:id
PUT    /api/progress/:id
DELETE /api/progress/:id

POST   /api/gamification
GET    /api/gamification/:id
PUT    /api/gamification/:id
DELETE /api/gamification/:id

POST   /api/exam
GET    /api/exam/:id
PUT    /api/exam/:id
DELETE /api/exam/:id
```

### Paso 2: Cambiar `.env.production`

```bash
REACT_APP_API_MODE=api
REACT_APP_API_URL=https://tu-api.com
REACT_APP_API_TOKEN=jwt_token
```

### Paso 3: ¡Listo!

No cambies nada más. Los servicios y componentes funcionarán igual.

---

##  Troubleshooting

 Problema  Solución 
--------------------
 "Datos no se guardan"  Verificar que localStorage no está desactivado en el navegador 
 "CORS error en API"  Configurar CORS en el backend 
 "401 Unauthorized"  Verificar que el token JWT es válido 
 "Hook not found"  Importar desde '@/hooks' o './hooks' 
 "Service not found"  Importar desde '@/services' o './services' 

---

##  Patrones Comunes

### Pattern 1: Cargar datos al montar

```javascript
const { stats, reload } = useProgress(userId);

useEffect(() => {
  reload();
}, [userId]);
```

### Pattern 2: Actualizar y mostrar feedback

```javascript
const { addXP, notification } = useGamification(userId);

const earnXP = async () => {
  await addXP(50, 'actividad');
  // notification se muestra automáticamente
};
```

### Pattern 3: Manejo de errores

```javascript
const { user, error, loading } = useUserData();

if (loading) return <Spinner />;
if (error) return <Error message={error} />;
return <Profile user={user} />;
```

---

**Documentación Completa**: Ver `NOTAS/ARQUITECTURA_SERVICIOS.md`  
**Ejemplos Detallados**: Ver `NOTAS/EJEMPLOS_SERVICIOS.js`  
**Plan de Migración**: Ver `NOTAS/GUIA_MIGRACION_BACKEND.md`
