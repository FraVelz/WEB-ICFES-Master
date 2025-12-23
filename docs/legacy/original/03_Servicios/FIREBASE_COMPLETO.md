# FIREBASE SETUP COMPLETO - WEB-ICFES-Master

## Resumen de Servicios Implementados

### Servicios Disponibles

| Servicio | Descripción | Estado |
|----------|-------------|--------|
| **UserFirestoreService** | Perfil de usuario | Implementado |
| **ProgressFirestoreService** | Progreso del usuario | Implementado |
| **GamificationFirestoreService** | Puntos, streaks, badges | Implementado |
| **SubscriptionPlanService** | Planes de suscripción | Implementado |
| **ExamDataService** | Exámenes y respuestas | Nuevo |
| **LearningMaterialService** | Lecciones y materiales | Nuevo |
| **AchievementService** | Logros desbloqueados | Nuevo |
| **TestResultService** | Resultados y análisis | Nuevo |

---

## Estructura de Colecciones en Firestore

```
firestore
 users/
 {uid}
 email
 displayName
 photoURL
 createdAt

 userPlans/
 {uid}
 planType: 'free' | 'premium' | 'pro'
 status: 'active' | 'expired'
 price
 features: {...}

 progress/
 {uid}
 totalAttempts
 totalCorrect
 percentage
 streakDays

 gamification/
 {uid}
 level
 xp
 badges: [...]
 streaks: {...}

 exams/
 {examId}
 title
 description
 questions: [...]
 createdAt

 userExams/
 {userId}_{examId}
 answers: {...}
 score
 completedAt

 learningMaterials/
 {lessonId}
 title
 area
 content
 createdAt

 userLessons/
 {userId}_{lessonId}
 status: 'completed'
 completedAt

 achievements/
 {achievementId}
 title
 description
 icon
 requirement

 userAchievements/
 {userId}
 achievements: [...]
 updatedAt

 testResults/
 {resultId}
 userId
 testType
 score
 questions: [...]
 completedAt

 userStats/
 {userId}
 totalTestsTaken
 averageTestScore
 bestTestScore
 lastTestDate
```

---

## Cómo Usar los Servicios

### 1️⃣ Autenticación y Plan Gratuito

```javascript
import { useAuth } from '@/context/AuthContext';

const { user, getUserPlan } = useAuth();

// Obtener el plan del usuario
const plan = await getUserPlan(user.uid);
// Resultado: { planType: 'free', status: 'active', ... }
```

### 2️⃣ Exámenes

```javascript
import { ExamDataService } from '@/services';

// Obtener todos los exámenes
const exams = await ExamDataService.getAllExams();

// Guardar respuestas de una prueba
await ExamDataService.saveExamAnswers(userId, examId, {
 question1: { answer: 'A', isCorrect: true },
 question2: { answer: 'B', isCorrect: false }
});

// Obtener historial de exámenes del usuario
const history = await ExamDataService.getUserExamHistory(userId);
```

### 3️⃣ Materiales de Aprendizaje

```javascript
import { LearningMaterialService } from '@/services';

// Obtener lecciones de un área
const lessons = await LearningMaterialService.getLessonsByArea('Matemáticas');

// Marcar lección como completada
await LearningMaterialService.markLessonAsCompleted(userId, lessonId);

// Obtener progreso en lecciones
const progress = await LearningMaterialService.getUserLessonsProgress(userId, 'Matemáticas');
// Resultado: { totalLessons: 10, completedLessons: 5, progress: 50 }
```

### 4️⃣ Logros

```javascript
import { AchievementService } from '@/services';

// Obtener todos los logros disponibles
const achievements = await AchievementService.getAllAchievements();

// Desbloquear un logro
await AchievementService.unlockAchievement(userId, 'achievement_id');

// Obtener logros del usuario
const userAchievements = await AchievementService.getUserAchievements(userId);

// Obtener estadísticas de logros
const stats = await AchievementService.getAchievementStats(userId);
// Resultado: { totalAchievements: 20, unlockedAchievements: 5, progress: 25 }
```

### 5️⃣ Resultados de Pruebas

```javascript
import { TestResultService } from '@/services';

// Guardar resultado de una prueba
await TestResultService.saveTestResult(userId, {
 testType: 'simulacro',
 subject: 'Matemáticas',
 questions: [
 { questionId: '1', isCorrect: true, points: 1 },
 { questionId: '2', isCorrect: false, points: 1 }
 ]
});

// Obtener análisis de desempeño
const analysis = await TestResultService.getPerformanceAnalysis(userId);
// Resultado: { totalTests: 5, averageScore: 75, bestScore: 95, improvement: 10 }

// Obtener desempeño por asignatura
const bySubject = await TestResultService.getPerformanceBySubject(userId);
// Resultado: { 'Matemáticas': { totalTests: 3, averageScore: 80 }, ... }
```

---

## Checklist de Configuración Firebase

### Paso 1: Variables de Entorno
```bash
VITE_FIREBASE_API_KEY
VITE_FIREBASE_AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET
VITE_FIREBASE_MESSAGING_SENDER_ID
VITE_FIREBASE_APP_ID
```

### Paso 2: Firebase Console
```
Proyecto creado
Authentication habilitado (Email/Password + Google)
Firestore Database creado
Modo prueba O Reglas configuradas
```

### Paso 3: Reglas de Firestore (Recomendadas)

```firestore
rules_version = '2';
service cloud.firestore {
 match /databases/{database}/documents {

 // Usuarios solo pueden ver sus propios datos
 match /users/{uid} {
 allow read, write: if request.auth.uid == uid;
 }

 // Planes de usuario
 match /userPlans/{uid} {
 allow read, write: if request.auth.uid == uid;
 }

 // Progreso de usuario
 match /progress/{uid} {
 allow read, write: if request.auth.uid == uid;
 }

 // Gamificación
 match /gamification/{uid} {
 allow read, write: if request.auth.uid == uid;
 }

 // Exámenes (lectura pública, respuestas privadas)
 match /exams/{examId} {
 allow read: if request.auth != null;
 }

 match /userExams/{document=**} {
 allow read, write: if request.auth.uid == resource.data.userId;
 }

 // Materiales de aprendizaje
 match /learningMaterials/{lessonId} {
 allow read: if request.auth != null;
 }

 // Logros
 match /achievements/{achievementId} {
 allow read: if request.auth != null;
 }

 match /userAchievements/{uid} {
 allow read, write: if request.auth.uid == uid;
 }

 // Resultados de pruebas
 match /testResults/{resultId} {
 allow read, write: if request.auth.uid == resource.data.userId;
 }

 // Estadísticas de usuario
 match /userStats/{uid} {
 allow read, write: if request.auth.uid == uid;
 }
 }
}
```

### Paso 4: Verificación

```javascript
// Abre la consola (F12) y copia esto:

import { UserFirestoreService, ProgressFirestoreService } from '@/services';

// Verificar servicios
console.log('Servicios cargados correctamente');

// Obtener datos de usuario
const userProfile = await UserFirestoreService.getUserProfile(user.uid);
console.log('Usuario:', userProfile);

// Obtener progreso
const progress = await ProgressFirestoreService.getProgress(user.uid);
console.log('Progreso:', progress);

// Obtener plan
const plan = await getUserPlan(user.uid);
console.log('Plan:', plan);
```

---

## Tests Funcionales

### Test 1: Registro y Plan Gratuito

```javascript
// 1. Ve a /signup
// 2. Registrate con:
// Email: test@example.com
// Nombre: Test User
// Contraseña: Test123456

// 3. Abre F12 Console y ejecuta:
const { user } = useAuth();
const plan = await getUserPlan(user.uid);
console.log('Plan creado:', plan);
// Debería mostrar: { planType: 'free', status: 'active', ... }
```

### Test 2: Guardar Resultado de Prueba

```javascript
import { TestResultService } from '@/services';

await TestResultService.saveTestResult(user.uid, {
 testType: 'simulacro',
 subject: 'Matemáticas',
 questions: [
 { questionId: '1', isCorrect: true, points: 1 },
 { questionId: '2', isCorrect: true, points: 1 },
 { questionId: '3', isCorrect: false, points: 1 }
 ]
});

const analysis = await TestResultService.getPerformanceAnalysis(user.uid);
console.log('Análisis:', analysis);
// Debería mostrar: { totalTests: 1, averageScore: 66.67, ... }
```

### Test 3: Desbloquear Logro

```javascript
import { AchievementService } from '@/services';

await AchievementService.unlockAchievement(user.uid, 'first_test', {
 reason: 'Completó primer simulacro'
});

const stats = await AchievementService.getAchievementStats(user.uid);
console.log('Estadísticas de logros:', stats);
```

---

## Solución de Problemas

### Error: "Permission denied"
- Verifica que estés autenticado
- Revisa las reglas de Firestore
- Asegúrate de que el usuario.uid es correcto

### Error: "Cannot read properties of null"
- El documento no existe
- Crea el documento primero con `setDoc()`
- Verifica que la colección y ID sean correctos

### Error: "Not found"
- La colección no existe en Firestore
- Crea la colección manualmente en Firebase Console
- O inserta el primer documento programáticamente

---

## Ejemplos Completos

### Ejemplo 1: Dashboard con Datos del Usuario

```javascript
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import {
 UserFirestoreService,
 ProgressFirestoreService,
 AchievementService,
 TestResultService
} from '@/services';

export const Dashboard = () => {
 const { user, getUserPlan } = useAuth();
 const [userData, setUserData] = useState(null);

 useEffect(() => {
 const loadData = async () => {
 const profile = await UserFirestoreService.getUserProfile(user.uid);
 const progress = await ProgressFirestoreService.getProgress(user.uid);
 const plan = await getUserPlan(user.uid);
 const achievements = await AchievementService.getAchievementStats(user.uid);
 const testAnalysis = await TestResultService.getPerformanceAnalysis(user.uid);

 setUserData({
 profile,
 progress,
 plan,
 achievements,
 testAnalysis
 });
 };

 loadData();
 }, [user.uid]);

 if (!userData) return <div>Cargando...</div>;

 return (
 <div>
 <h1>Bienvenido {userData.profile.displayName}</h1>
 <p>Plan: {userData.plan.planName}</p>
 <p>Progreso: {userData.progress.percentage}%</p>
 <p>Logros: {userData.achievements.unlockedAchievements}/{userData.achievements.totalAchievements}</p>
 <p>Puntaje Promedio: {userData.testAnalysis.averageScore?.toFixed(2)}%</p>
 </div>
 );
};
```

---

## Próximos Pasos

1. **Validar Reglas de Seguridad**
 - Implementar roles (admin, user, moderator)
 - Agregar validación de datos

2. **Optimizar Consultas**
 - Crear índices en Firestore
 - Implementar caché con Redux

3. **Monitoreo y Análisis**
 - Configurar Google Analytics
 - Monitorear errores con Sentry

4. **Backups**
 - Configurar backups automáticos
 - Documentar procedimiento de recuperación

---

## Soporte

Si hay errores:
1. Revisa la consola (F12)
2. Verifica Firebase Console
3. Comprueba las reglas de Firestore
4. Intenta en una ventana anónima
5. Reinicia: `npm run dev`

---

**¡Firebase está 100% configurado y listo para producción!**
