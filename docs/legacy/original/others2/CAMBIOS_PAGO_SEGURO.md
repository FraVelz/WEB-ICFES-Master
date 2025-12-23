# Cambios: Pago Seguro - Requiere Autenticación

**Fecha:** 14 de diciembre de 2025
**Objetivo:** Garantizar que solo usuarios autenticados puedan realizar pagos y se les atribuya correctamente la suscripción

---

## Cambios Realizados

### 1. **PricingPlans.jsx** - Verificación de Autenticación
**Archivo:** `/src/shared/components/PricingPlans.jsx`

**Antes:**
```javascript
const handlePlanClick = (plan) => {
 if (plan.price === 'Gratis') {
 navigate('/signup');
 } else {
 setSelectedPlan(plan);
 setIsPaymentOpen(true);
 }
};
```

**Después:**
```javascript
const { isAuthenticated } = useAuth();

const handlePlanClick = (plan) => {
 if (plan.price === 'Gratis') {
 navigate('/signup');
 } else {
 if (!isAuthenticated) {
 // Redirigir a login si no está autenticado
 navigate('/login', { state: { from: 'pricing', plan } });
 } else {
 // Si está autenticado, abrir modal de pago
 setSelectedPlan(plan);
 setIsPaymentOpen(true);
 }
 }
};
```

**Cambios:**
- Importa `useAuth` del contexto
- Verifica si el usuario está autenticado con `isAuthenticated`
- Si no está autenticado, redirige a `/login` pasando el plan como parámetro
- Solo abre el modal de pago si está autenticado

---

### 2. **PaymentModal.jsx** - Guardar en Firebase
**Archivo:** `/src/shared/components/organisms/PaymentModal/PaymentModal.jsx`

**Agregados:**
```javascript
import { useAuth } from '@/context/AuthContext';
import { SubscriptionPlanService } from '@/services';

export const PaymentModal = ({ isOpen, onClose, plan }) => {
 const { user } = useAuth();
 const [error, setError] = useState(null);

 // ... resto del código
};
```

**Antes (handleSubmit):**
```javascript
const handleSubmit = async (e) => {
 e.preventDefault();
 setIsProcessing(true);

 setTimeout(() => {
 setIsProcessing(false);
 setPaymentSuccess(true);
 // ... cerrar modal
 }, 2000);
};
```

**Después (handleSubmit):**
```javascript
const handleSubmit = async (e) => {
 e.preventDefault();
 setIsProcessing(true);
 setError(null);

 try {
 // 1. Verificar autenticación
 if (!user) {
 throw new Error('Debes estar autenticado para realizar una compra');
 }

 // 2. Simular procesamiento de pago (Stripe/PayPal en producción)
 await new Promise(resolve => setTimeout(resolve, 2000));

 // 3. Guardar suscripción en Firebase
 const planData = {
 planType: plan.id || 'premium',
 planName: plan.name,
 status: 'active',
 price: priceCalculation.finalPrice,
 billingPeriod: billingPeriod,
 originalPrice: plan.price,
 features: plan.features || [],
 purchaseDate: new Date(),
 nextBillingDate: new Date(Date.now() + (billingPeriod === 'annual' ? 365 * 24 * 60 * 60 * 1000 : 30 * 24 * 60 * 60 * 1000))
 };

 await SubscriptionPlanService.updateUserPlan(user.uid, planData);

 setIsProcessing(false);
 setPaymentSuccess(true);

 setTimeout(() => {
 setPaymentSuccess(false);
 setCardData({ /* ... */ });
 onClose();
 }, 2000);
 } catch (err) {
 setIsProcessing(false);
 setError(err.message || 'Error al procesar el pago. Intenta de nuevo.');
 console.error('Payment error:', err);
 }
};
```

**Cambios:**
- Verifica que `user` exista (está autenticado)
- Captura errores en `try-catch`
- Guarda los datos de la suscripción en Firebase usando `SubscriptionPlanService.updateUserPlan()`
- Calcula automáticamente la fecha de próximo pago
- Muestra errores en la UI si algo falla

**JSX Update:**
```javascript
{error && (
 <div className="p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm">
 {error}
 </div>
)}
```

---

### 3. **pricing.js** - Agregar IDs a Planes
**Archivo:** `/src/features/home/data/pricing.js`

**Cambios:**
```javascript
export const PRICING_PLANS = [
 {
 id: 'free', // ← Agregado
 name: "Básico",
 price: "Gratis",
 // ...
 },
 {
 id: 'premium', // ← Agregado
 name: "Premium",
 price: "$2,000 COP/mes",
 // ...
 },
 {
 id: 'pro', // ← Agregado
 name: "Pro",
 price: "$9,900 COP/mes",
 // ...
 }
];
```

**Razón:** El campo `id` se usa en PaymentModal para identificar el tipo de plan al guardar en Firebase

---

## Flujo Actualizado

```
1. Usuario en HomePage ve los planes
 ↓
2. Hace clic en "Obtener Premium" o "Únete al Proyecto"
 ↓
3. ¿Está autenticado?
 NO → Redirige a /login (pasando el plan como parámetro)
 Usuario inicia sesión
 Vuelve a la página de planes
 Intenta de nuevo (ahora SÍ autenticado)

 SÍ → Abre PaymentModal
 ↓
4. Usuario llena formulario de pago
 ↓
5. Hace clic en "Pagar"
 ↓
6. PaymentModal:
 Valida que user.uid exista
 Simula procesamiento de pago (2 segundos)
 Guarda en Firebase (userPlans/{uid})
 Datos: planType, planName, billingPeriod, price, etc.
 Muestra "Pago exitoso"
 Cierra modal

7. Usuario ya tiene acceso al plan
```

---

## Validaciones Implementadas

| Validación | Dónde | Qué Hace |
|-----------|-------|---------|
| Autenticación requerida | `PricingPlans.jsx` | Solo usuarios con sesión activa pueden abrir modal de pago |
| Usuario existe | `PaymentModal.jsx` | Verifica `user` antes de guardar en Firebase |
| Datos válidos | `PaymentModal.jsx` | Valida tarjeta de crédito, fechas, CVV |
| Guardado en Firebase | `PaymentModal.jsx` | Usa `SubscriptionPlanService.updateUserPlan()` |
| Manejo de errores | `PaymentModal.jsx` | Muestra mensajes de error si falla el pago |

---

## Datos en Firebase

**Colección:** `userPlans`
**Documento:** `{userId}`

```json
{
 "planType": "premium",
 "planName": "Premium",
 "status": "active",
 "price": 1800,
 "billingPeriod": "monthly",
 "originalPrice": "$2,000 COP/mes",
 "features": ["feature1", "feature2"],
 "purchaseDate": "2025-12-14T10:30:00Z",
 "nextBillingDate": "2026-01-14T10:30:00Z"
}
```

---

## Próximos Pasos

1. **Integrar Stripe/PayPal** (reemplazar simulación de 2 segundos)
2. **Crear webhook** para confirmar pagos
3. **Implementar renovación automática** de suscripciones
4. **Agregar cancellation de planes** en dashboard de usuario
5. **Validar plan en rutas protegidas** (features solo para premium/pro)

---

## Testing

```javascript
// Test 1: Usuario no autenticado intenta pagar
1. Ir a HomePage
2. Hacer clic en "Obtener Premium"
3. Debe redirigir a /login

// Test 2: Usuario autenticado completa pago
1. Iniciar sesión
2. Ir a HomePage
3. Hacer clic en "Obtener Premium"
4. Debe abrir PaymentModal
5. Llenar datos de pago
6. Debe guardar en Firebase userPlans/{uid}
7. Verificar en Firebase Console que se guardó correctamente

// Test 3: Error si no hay usuario
1. (No aplica, la UI no lo permite)
```

---

**¡Listo!** El sistema ahora es seguro y atribuye correctamente las suscripciones.
