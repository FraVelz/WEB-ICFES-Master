# 📚 Documentación Completa: Firebase en WEB-ICFES

## 📋 Tabla de Contenidos
1. [Configuración de Firebase](#configuración-de-firebase)
2. [Estructura de Bases de Datos](#estructura-de-bases-de-datos)
3. [Servicios Firebase](#servicios-firebase)
4. [Flujo de Datos](#flujo-de-datos)
5. [Guía de Uso en Componentes](#guía-de-uso-en-componentes)
6. [Colecciones y Documentos](#colecciones-y-documentos)

---

## 🔧 Configuración de Firebase

### Archivo: `src/config/firebase.js`

```javascript
// Importaciones necesarias
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
```

**Qué hace:**
- Inicializa Firebase con las credenciales del proyecto
- Exporta `auth` para autenticación
- Exporta `db` para acceso a Firestore (base de datos)

**Variables de entorno requeridas** (en `.env`):
```
VITE_FIREBASE_API_KEY=xxxxx
VITE_FIREBASE_AUTH_DOMAIN=xxxxx
VITE_FIREBASE_PROJECT_ID=xxxxx
VITE_FIREBASE_STORAGE_BUCKET=xxxxx
VITE_FIREBASE_MESSAGING_SENDER_ID=xxxxx
VITE_FIREBASE_APP_ID=xxxxx
```

**Exportaciones:**
- `auth`: Instancia de autenticación Firebase
- `db`: Instancia de Firestore (base de datos)
- `app`: Aplicación Firebase

---

## 💾 Estructura de Bases de Datos

### Firestore Collections (Colecciones)

```
Firebase Project (WEB-ICFES)
│
├── users/
│   ├── {userId}/
│   │   ├── email: string
│   │   ├── displayName: string
│   │   ├── photoURL: string (opcional)
│   │   ├── createdAt: timestamp
│   │   └── updatedAt: timestamp
│   │
│   └── {userId}/
│       └── ...
│
├── userProgress/
│   ├── {userId}/
│   │   ├── totalAttempts: number
│   │   ├── totalCorrect: number
│   │   ├── percentage: number
│   │   ├── streakDays: number
│   │   ├── lastActivityDate: timestamp
│   │   └── updatedAt: timestamp
│   │
│   └── {userId}/
│       └── ...
│
├── userGamification/
│   ├── {userId}/
│   │   ├── xp: number
│   │   ├── level: number
│   │   ├── points: number
│   │   ├── badges: array
│   │   ├── achievements: array
│   │   └── updatedAt: timestamp
│   │
│   └── {userId}/
│       └── ...
│
├── userPlans/
│   ├── {userId}/
│   │   ├── planType: string (free|pro|premium)
│   │   ├── planName: string
│   │   ├── status: string (active|expired|suspended)
│   │   ├── price: number
│   │   ├── billingPeriod: string (monthly|annual|free)
│   │   ├── purchaseDate: timestamp
│   │   ├── nextBillingDate: timestamp
│   │   ├── features: object
│   │   └── updatedAt: timestamp
│   │
│   └── {userId}/
│       └── ...
│
├── scheduledPlans/
│   ├── {planId}/
│   │   ├── userId: string
│   │   ├── planType: string
│   │   ├── planName: string
│   │   ├── status: string (pending|activated|cancelled)
│   │   ├── scheduledFor: timestamp
│   │   ├── price: number
│   │   ├── billingPeriod: string
│   │   ├── features: object
│   │   ├── createdAt: timestamp
│   │   └── updatedAt: timestamp
│   │
│   └── {planId}/
│       └── ...
│
├── examResults/
│   ├── {resultId}/
│   │   ├── userId: string
│   │   ├── examType: string
│   │   ├── score: number
│   │   ├── totalQuestions: number
│   │   ├── correctAnswers: number
│   │   ├── timeSpent: number
│   │   ├── completedAt: timestamp
│   │   └── questions: array
│   │
│   └── {resultId}/
│       └── ...
│
└── userBadges/
    ├── {userId}/
    │   ├── {badgeId}/
    │   │   ├── name: string
    │   │   ├── description: string
    │   │   ├── icon: string
    │   │   ├── earnedAt: timestamp
    │   │   └── tier: number
    │   │
    │   └── {badgeId}/
    │       └── ...
    │
    └── {userId}/
        └── ...
```

---

## 🔌 Servicios Firebase

### 1. **UserFirestoreService** (`src/services/UserFirestoreService.js`)

**Métodos principales:**

```javascript
// Crear perfil de usuario
await UserFirestoreService.createUserProfile(uid, userData)
// Guarda en: /users/{uid}

// Obtener perfil de usuario
const profile = await UserFirestoreService.getUserProfile(uid)
// Lee desde: /users/{uid}

// Actualizar perfil
await UserFirestoreService.updateUserProfile(uid, updates)
// Actualiza: /users/{uid}
```

**Líneas de código en componentes:**
```jsx
// Ejemplo en AuthContext.jsx (línea ~62)
await UserFirestoreService.createUserProfile(userCredential.user.uid, {
  email,
  displayName
});
```

---

### 2. **ProgressFirestoreService** (`src/services/ProgressFirestoreService.js`)

**Métodos principales:**

```javascript
// Actualizar progreso
await ProgressFirestoreService.updateProgress(uid, progressData)
// Guarda en: /userProgress/{uid}

// Obtener progreso
const progress = await ProgressFirestoreService.getProgress(uid)
// Lee desde: /userProgress/{uid}

// Incrementar intentos
await ProgressFirestoreService.incrementAttempts(uid, correct)
// Actualiza /userProgress/{uid}
```

**Líneas de código en componentes:**
```jsx
// Ejemplo en AuthContext.jsx (línea ~69)
await ProgressFirestoreService.updateProgress(userCredential.user.uid, {
  totalAttempts: 0,
  totalCorrect: 0,
  percentage: 0,
  streakDays: 0
});
```

---

### 3. **GamificationFirestoreService** (`src/services/GamificationFirestoreService.js`)

**Métodos principales:**

```javascript
// Crear perfil de gamificación
await GamificationFirestoreService.createGamificationProfile(uid)
// Guarda en: /userGamification/{uid}

// Agregar XP
await GamificationFirestoreService.addXP(uid, xpAmount, reason)
// Actualiza: /userGamification/{uid}

// Obtener insignias
const badges = await GamificationFirestoreService.getUserBadges(uid)
// Lee desde: /userBadges/{uid}
```

**Líneas de código en componentes:**
```jsx
// Ejemplo en AuthContext.jsx (línea ~74)
await GamificationFirestoreService.createGamificationProfile(userCredential.user.uid);
```

---

### 4. **SubscriptionPlanService** (`src/services/SubscriptionPlanService.js`)

**Métodos principales:**

```javascript
// Crear plan gratuito por defecto
await SubscriptionPlanService.createDefaultPlan(uid)
// Guarda en: /userPlans/{uid}

// Obtener plan actual
const plan = await SubscriptionPlanService.getUserPlan(uid)
// Lee desde: /userPlans/{uid}

// Actualizar plan
await SubscriptionPlanService.updateUserPlan(uid, planData)
// Actualiza: /userPlans/{uid}

// Verificar si tiene plan activo
const hasActive = await SubscriptionPlanService.hasActivePlan(uid)
// Lee desde: /userPlans/{uid}
```

**Líneas de código en componentes:**
```jsx
// Ejemplo en AuthContext.jsx (línea ~77)
await SubscriptionPlanService.createDefaultPlan(userCredential.user.uid);

// Ejemplo en PaymentModal.jsx (línea ~79)
const planData = {
  planType: plan.id || 'free',
  planName: plan.name,
  status: 'active',
  price: 0,
  billingPeriod: 'free',
  features: plan.features || [],
  purchaseDate: new Date(),
  nextBillingDate: null
};
await SubscriptionPlanService.updateUserPlan(user.uid, planData);
```

---

### 5. **PlanScheduleService** (`src/services/PlanScheduleService.js`)

**Métodos principales:**

```javascript
// Obtener planes programados
const scheduled = await PlanScheduleService.getScheduledPlans(uid)
// Lee desde: /scheduledPlans

// Validar si puede programar
const validation = await PlanScheduleService.validatePlanScheduling(uid)
// Retorna: { canSchedule: boolean, reason: string }

// Programar plan
await PlanScheduleService.schedulePlan(uid, planData)
// Guarda en: /scheduledPlans/{planId}

// Activar plan programado
await PlanScheduleService.activateScheduledPlan(uid)
// Actualiza: /userPlans/{uid} y /scheduledPlans/{planId}
```

**Líneas de código en componentes:**
```jsx
// Ejemplo en PaymentModal.jsx (línea ~125)
const validation = await PlanScheduleService.validatePlanScheduling(user.uid);
setCanSchedulePlan(validation.canSchedule);

// Línea ~115
await PlanScheduleService.schedulePlan(user.uid, planData);
```

---

### 6. **ExamFirestoreService** (`src/services/ExamFirestoreService.js`)

**Métodos principales:**

```javascript
// Guardar resultado de examen
await ExamFirestoreService.saveExamResult(uid, examData)
// Guarda en: /examResults/{resultId}

// Obtener resultados del usuario
const results = await ExamFirestoreService.getUserExamResults(uid)
// Lee desde: /examResults
```

---

## 🔄 Flujo de Datos

### Flujo 1: Registro de Usuario

```
Usuario completa formulario de registro
          ↓
AuthContext.signup() se ejecuta (línea ~50)
          ↓
createUserWithEmailAndPassword() - Firebase Auth (línea ~53)
          ↓
UserFirestoreService.createUserProfile() (línea ~62)
    └─→ Guarda en /users/{uid}
          ↓
ProgressFirestoreService.updateProgress() (línea ~69)
    └─→ Guarda en /userProgress/{uid}
          ↓
GamificationFirestoreService.createGamificationProfile() (línea ~74)
    └─→ Guarda en /userGamification/{uid}
          ↓
SubscriptionPlanService.createDefaultPlan() (línea ~77)
    └─→ Guarda en /userPlans/{uid}
          ↓
Usuario registrado exitosamente
```

### Flujo 2: Compra de Plan (Cambio de Plan)

```
Usuario abre modal de pago
          ↓
PaymentModal carga plan actual (línea ~45)
    └─→ SubscriptionPlanService.getUserPlan(uid)
    └─→ Lee de /userPlans/{uid}
          ↓
PaymentModal valida si puede programar (línea ~52)
    └─→ PlanScheduleService.validatePlanScheduling(uid)
    └─→ Verifica /userPlans/{uid} y /scheduledPlans
          ↓
Usuario confirma pago
          ↓
Si tiene plan activo:
    └─→ PlanScheduleService.schedulePlan() (línea ~115)
    └─→ Guarda en /scheduledPlans/{planId}
    └─→ SuccessMessage muestra "en espera de activación"
          ↓
Si NO tiene plan activo:
    └─→ SubscriptionPlanService.updateUserPlan() (línea ~118)
    └─→ Actualiza /userPlans/{uid}
    └─→ SuccessMessage muestra "activado inmediatamente"
```

### Flujo 3: Activación Automática de Plan

```
Usuario entra a la web
          ↓
App.jsx ejecuta usePlanScheduleChecker() (línea ~54)
          ↓
Hook ejecuta cada 5 minutos:
    └─→ PlanScheduleService.activateScheduledPlan(uid)
    └─→ Lee /scheduledPlans donde userId === uid
          ↓
Si llegó la fecha de activación:
    └─→ Obtiene plan de /scheduledPlans/{planId}
    └─→ Actualiza /userPlans/{uid} con nuevo plan
    └─→ Marca /scheduledPlans/{planId} como "activated"
          ↓
Plan activado automáticamente
```

---

## 📱 Guía de Uso en Componentes

### Patrón 1: Obtener Datos en useEffect

```jsx
// Patrón general
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { SubscriptionPlanService } from '@/services';

export const MiComponente = () => {
  const { user } = useAuth();
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const cargarPlan = async () => {
      try {
        setLoading(true);
        // 1. Llamar al servicio
        const userPlan = await SubscriptionPlanService.getUserPlan(user.uid);
        // 2. Guardar en estado
        setPlan(userPlan);
      } catch (err) {
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    cargarPlan();
  }, [user]);

  if (loading) return <p>Cargando...</p>;
  if (!plan) return <p>Sin plan</p>;

  return <div>{plan.planName}</div>;
};
```

### Patrón 2: Guardar Datos

```jsx
// Patrón general para guardar/actualizar
const handleSave = async () => {
  try {
    // 1. Preparar datos
    const datos = {
      planType: 'premium',
      planName: 'Plan Premium',
      status: 'active'
    };

    // 2. Llamar al servicio
    await SubscriptionPlanService.updateUserPlan(user.uid, datos);

    // 3. Mostrar confirmación
    showMessage('¡Guardado exitosamente!');
  } catch (err) {
    showError('Error al guardar');
  }
};
```

### Patrón 3: Usar AuthContext

```jsx
// En cualquier componente
import { useAuth } from '@/context/AuthContext';

export const MiComponente = () => {
  const { user, isAuthenticated, signup, logout } = useAuth();

  return (
    <div>
      {isAuthenticated ? (
        <p>Bienvenido {user.displayName}</p>
      ) : (
        <p>Por favor inicia sesión</p>
      )}
    </div>
  );
};
```

---

## 📊 Colecciones y Documentos

### Estructura completa de datos

#### Colección: `users`
```json
{
  "email": "usuario@example.com",
  "displayName": "Juan Pérez",
  "photoURL": "https://...",
  "createdAt": "2024-12-15T10:30:00Z",
  "updatedAt": "2024-12-15T10:30:00Z"
}
```

#### Colección: `userProgress`
```json
{
  "totalAttempts": 150,
  "totalCorrect": 120,
  "percentage": 80,
  "streakDays": 15,
  "lastActivityDate": "2024-12-15T14:20:00Z",
  "updatedAt": "2024-12-15T14:20:00Z"
}
```

#### Colección: `userGamification`
```json
{
  "xp": 5000,
  "level": 8,
  "points": 2500,
  "badges": ["badge1", "badge2"],
  "achievements": ["achievement1"],
  "updatedAt": "2024-12-15T14:20:00Z"
}
```

#### Colección: `userPlans`
```json
{
  "planType": "premium",
  "planName": "Plan Premium",
  "status": "active",
  "price": 49.99,
  "billingPeriod": "monthly",
  "originalPrice": 49.99,
  "features": {
    "questionsPerDay": 50,
    "simulationTests": true,
    "advancedAnalytics": true,
    "prioritySupport": true
  },
  "purchaseDate": "2024-12-15T10:00:00Z",
  "nextBillingDate": "2025-01-15T10:00:00Z",
  "updatedAt": "2024-12-15T10:00:00Z"
}
```

#### Colección: `scheduledPlans`
```json
{
  "userId": "user123",
  "planType": "pro",
  "planName": "Plan Pro",
  "status": "pending",
  "price": 29.99,
  "billingPeriod": "monthly",
  "features": {...},
  "scheduledFor": "2025-01-15T10:00:00Z",
  "createdAt": "2024-12-15T14:20:00Z",
  "updatedAt": "2024-12-15T14:20:00Z"
}
```

---

## 🔐 Reglas de Seguridad (Firestore Rules)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Permitir lectura/escritura solo al usuario autenticado
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
    }
    
    match /userProgress/{userId} {
      allow read, write: if request.auth.uid == userId;
    }
    
    match /userGamification/{userId} {
      allow read, write: if request.auth.uid == userId;
    }
    
    match /userPlans/{userId} {
      allow read, write: if request.auth.uid == userId;
    }
    
    match /scheduledPlans/{planId} {
      allow read, write: if request.auth.uid == resource.data.userId;
    }
  }
}
```

---

## 📝 Resumen: Archivos Relacionados

| Archivo | Propósito | Interactúa con |
|---------|-----------|----------------|
| `src/config/firebase.js` | Configuración inicial de Firebase | Todos los servicios |
| `src/context/AuthContext.jsx` | Gestión de autenticación y contexto | UserFirestoreService, ProgressFirestoreService, GamificationFirestoreService, SubscriptionPlanService |
| `src/services/UserFirestoreService.js` | CRUD de perfiles de usuario | `/users/{uid}` |
| `src/services/ProgressFirestoreService.js` | CRUD de progreso | `/userProgress/{uid}` |
| `src/services/GamificationFirestoreService.js` | CRUD de gamificación y insignias | `/userGamification/{uid}`, `/userBadges/{uid}` |
| `src/services/SubscriptionPlanService.js` | CRUD de planes de suscripción | `/userPlans/{uid}` |
| `src/services/PlanScheduleService.js` | Gestión de planes programados | `/scheduledPlans`, `/userPlans/{uid}` |
| `src/services/ExamFirestoreService.js` | CRUD de resultados de exámenes | `/examResults` |
| `src/hooks/usePlanScheduleChecker.js` | Hook para activación automática | PlanScheduleService |
| `src/shared/components/organisms/PaymentModal/PaymentModal.jsx` | Modal de pago | SubscriptionPlanService, PlanScheduleService |
| `src/App.jsx` | Componente raíz | usePlanScheduleChecker |

---

## 🎓 Ejemplos de Uso Práctico

### Ejemplo 1: Obtener y mostrar plan del usuario

```jsx
// En cualquier componente
import { useAuth } from '@/context/AuthContext';
import { SubscriptionPlanService } from '@/services';

export const PlanInfo = () => {
  const { user } = useAuth();
  const [plan, setPlan] = useState(null);

  useEffect(() => {
    if (!user) return;

    const loadPlan = async () => {
      const userPlan = await SubscriptionPlanService.getUserPlan(user.uid);
      setPlan(userPlan);
    };

    loadPlan();
  }, [user]);

  return <h2>Tu plan: {plan?.planName}</h2>;
};
```

### Ejemplo 2: Actualizar progreso después de un examen

```jsx
// En componente después de completar examen
import { ProgressFirestoreService } from '@/services';

const handleExamComplete = async (score) => {
  await ProgressFirestoreService.updateProgress(user.uid, {
    totalAttempts: currentProgress.totalAttempts + 1,
    totalCorrect: currentProgress.totalCorrect + (score > 70 ? 1 : 0),
    percentage: calculatePercentage(...)
  });
};
```

### Ejemplo 3: Agregar XP cuando completa una pregunta

```jsx
// En componente de preguntas
import { GamificationFirestoreService } from '@/services';

const handleAnswerCorrect = async () => {
  await GamificationFirestoreService.addXP(
    user.uid,
    100,
    'pregunta correcta'
  );
};
```

---

## 🚀 Checklist para entender el flujo

- [ ] Entender que Firebase tiene dos partes: `auth` (autenticación) y `db` (Firestore)
- [ ] Cada usuario tiene un `uid` único que se usa como ID en todas las colecciones
- [ ] Los servicios son clases que encapsulan la lógica de Firebase
- [ ] AuthContext maneja toda la autenticación y datos globales del usuario
- [ ] Los hooks (`useAuth`) permiten acceder a los datos en cualquier componente
- [ ] Cada colección tiene reglas de seguridad que solo permiten acceso al propio usuario
- [ ] Los planes pueden estar activos o programados para después
- [ ] El hook `usePlanScheduleChecker` revisa cada 5 minutos si hay planes que activar

---

**Última actualización:** 15 de Diciembre de 2025
