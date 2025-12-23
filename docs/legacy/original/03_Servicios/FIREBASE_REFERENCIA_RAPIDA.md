# FIREBASE - REFERENCIA RÁPIDA

## Importar Servicios

```javascript
import {
 UserFirestoreService,
 ProgressFirestoreService,
 GamificationFirestoreService,
 SubscriptionPlanService,
 ExamDataService,
 LearningMaterialService,
 AchievementService,
 TestResultService
} from '@/services';

// O importar del contexto
import { useAuth } from '@/context/AuthContext';
const { getUserPlan, updateUserPlan } = useAuth();
```

---

## Usuario

```javascript
// Crear perfil (automático en signup)
await UserFirestoreService.createUserProfile(uid, { email, displayName });

// Obtener perfil
const profile = await UserFirestoreService.getUserProfile(uid);

// Actualizar perfil
await UserFirestoreService.updateUserProfile(uid, { displayName: 'Nuevo Nombre' });
```

---

## Progreso

```javascript
// Actualizar progreso
await ProgressFirestoreService.updateProgress(uid, {
 totalAttempts: 10,
 totalCorrect: 8,
 percentage: 80,
 streakDays: 5
});

// Obtener progreso
const progress = await ProgressFirestoreService.getProgress(uid);
```

---

## Gamificación

```javascript
// Agregar XP
await GamificationFirestoreService.addXP(uid, 50, 'Pregunta correcta');

// Obtener perfil
const profile = await GamificationFirestoreService.getProfile(uid);

// Obtener nivel
const level = await GamificationFirestoreService.getLevel(uid);
```

---

## Suscripción

```javascript
// Obtener plan del usuario
const plan = await getUserPlan(uid);

// Actualizar plan
await updateUserPlan(uid, {
 planType: 'premium',
 planName: 'Plan Premium',
 status: 'active'
});

// Verificar si tiene plan activo
const hasActive = await SubscriptionPlanService.hasActivePlan(uid);
```

---

## Exámenes

```javascript
// Obtener todos los exámenes
const exams = await ExamDataService.getAllExams();

// Obtener examen específico
const exam = await ExamDataService.getExam(examId);

// Guardar respuestas
await ExamDataService.saveExamAnswers(uid, examId, {
 q1: { answer: 'A', isCorrect: true },
 q2: { answer: 'B', isCorrect: false }
});

// Obtener respuestas guardadas
const answers = await ExamDataService.getUserExamAnswers(uid, examId);

// Historial de exámenes
const history = await ExamDataService.getUserExamHistory(uid);
```

---

## Materiales de Aprendizaje

```javascript
// Obtener lecciones de un área
const lessons = await LearningMaterialService.getLessonsByArea('Matemáticas');

// Obtener lección específica
const lesson = await LearningMaterialService.getLesson(lessonId);

// Marcar como completada
await LearningMaterialService.markLessonAsCompleted(uid, lessonId);

// Obtener progreso
const progress = await LearningMaterialService.getUserLessonsProgress(uid, 'Matemáticas');
// { totalLessons: 10, completedLessons: 5, progress: 50 }
```

---

## Logros

```javascript
// Obtener todos los logros
const achievements = await AchievementService.getAllAchievements();

// Desbloquear logro
await AchievementService.unlockAchievement(uid, 'achievement_id');

// Obtener logros del usuario
const userAchievements = await AchievementService.getUserAchievements(uid);

// Verificar si tiene un logro
const hasAchievement = await AchievementService.hasAchievement(uid, 'achievement_id');

// Estadísticas de logros
const stats = await AchievementService.getAchievementStats(uid);
// { totalAchievements: 20, unlockedAchievements: 5, progress: 25 }
```

---

## Resultados de Pruebas

```javascript
// Guardar resultado
await TestResultService.saveTestResult(uid, {
 testType: 'simulacro',
 subject: 'Matemáticas',
 questions: [
 { questionId: '1', isCorrect: true, points: 1 },
 { questionId: '2', isCorrect: false, points: 1 }
 ]
});

// Obtener resultado específico
const result = await TestResultService.getTestResult(resultId);

// Obtener todos los resultados del usuario
const results = await TestResultService.getUserTestResults(uid);

// Obtener por tipo de prueba
const simulacros = await TestResultService.getUserTestResultsByType(uid, 'simulacro');

// Análisis de desempeño
const analysis = await TestResultService.getPerformanceAnalysis(uid);
// {
// totalTests: 5,
// averageScore: 75,
// bestScore: 95,
// improvement: 10,
// scoreHistory: [70, 75, 80, 85, 95]
// }

// Desempeño por asignatura
const bySubject = await TestResultService.getPerformanceBySubject(uid);
// {
// 'Matemáticas': { totalTests: 3, averageScore: 80 },
// 'Inglés': { totalTests: 2, averageScore: 70 }
// }
```

---

## Autenticación

```javascript
import { useAuth } from '@/context/AuthContext';

const {
 user, // Usuario actual
 signup, // Registrarse
 login, // Iniciar sesión
 logout, // Cerrar sesión
 isAuthenticated // ¿Está autenticado?
} = useAuth();

// Registrarse
await signup(email, password, displayName);

// Iniciar sesión
await login(email, password);

// Cerrar sesión
await logout();

// Verificar autenticación
if (isAuthenticated) {
 console.log('Usuario:', user);
}
```

---

## ️ Estructura en Firestore

```
firestore
 users/{uid}
 userPlans/{uid}
 progress/{uid}
 gamification/{uid}
 exams/{examId}
 userExams/{userId}_{examId}
 learningMaterials/{lessonId}
 userLessons/{userId}_{lessonId}
 achievements/{achievementId}
 userAchievements/{uid}
 testResults/{resultId}
 userStats/{uid}
```

---

## Ejemplo Completo

```javascript
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { TestResultService, AchievementService } from '@/services';

export const ExamPage = () => {
 const { user, getUserPlan } = useAuth();
 const [result, setResult] = useState(null);

 const handleExamComplete = async (answers) => {
 // 1. Guardar resultado
 const resultId = await TestResultService.saveTestResult(user.uid, {
 testType: 'simulacro',
 subject: 'Matemáticas',
 questions: answers
 });

 // 2. Verificar logro
 const analysis = await TestResultService.getPerformanceAnalysis(user.uid);
 if (analysis.averageScore > 80) {
 await AchievementService.unlockAchievement(user.uid, 'high_scorer');
 }

 // 3. Mostrar resultado
 setResult(analysis);
 };

 return (
 <div>
 {result && (
 <div>
 <p>Puntaje Promedio: {result.averageScore}%</p>
 <p>Mejor: {result.bestScore}%</p>
 <p>Mejora: {result.improvement}%</p>
 </div>
 )}
 </div>
 );
};
```

---

## Errores Comunes

| Error | Causa | Solución |
|-------|-------|----------|
| `Permission denied` | No autenticado | Verifica `useAuth()` |
| `Cannot read null` | Documento no existe | Crea con `setDoc()` primero |
| `Not found` | Colección no existe | Crea en Firebase Console |
| `quota exceeded` | Demasiadas consultas | Implementa caché |

---

## Tips

- Siempre verifica que `user` existe antes de hacer consultas
- Usa `try-catch` para manejar errores
- Guarda datos en `localStorage` para caché local
- Implementa loading states mientras cargas datos
- Usa `useMemo` para evitar re-renders innecesarios

---

**¡Listo para usar!**
