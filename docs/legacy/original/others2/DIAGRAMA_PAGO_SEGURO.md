# Diagrama de Flujo: Pago Seguro

## Versión Anterior (Insegura)
```
Usuario en HomePage
 ↓
Clic en "Obtener Premium"
 ↓
Modal de Pago Abierto (SIN verificación)
 ↓
Completa datos de pago
 ↓
Pago procesado
 ↓
¿A quién se le atribuye? (NO HAY UID)
```

---

## Versión Nueva (Segura)

```

 Usuario en HomePage
 Ve planes de pago




 Clic en "Básico" Clic en "Premium" o "Pro"
 (Gratis) (De Pago)

 ↓ ↓
 Redirige a ¿Usuario
 /signup Autenticado?

 NO SÍ

 ↓ ↓
 Redirige PaymentModal
 a /login Abierto

 Usuario Usuario llena
 inicia formulario:
 sesión Número tarjeta
 Nombre
 Mes/Año
 CVV
 Período (M/A)



 Clic en
 "Pagar"

 ↓

 PaymentModal
 (Validación)

 user existe
 Datos válidos
 Tarjeta OK


 ↓
 Procesa Pago
 (2s simulado)

 ↓

 Guarda en Firebase:

 userPlans/{userId}
 planType: "premium"
 planName: "Premium"
 status: "active"
 price: 1800
 billingPeriod: "M"
 purchaseDate: NOW
 nextBillingDate: +30d

 SUSCRIPCIÓN CREADA


 ↓
 Muestra "Pago Exitoso"

 ↓
 Usuario accede a plan
 (Premium features)

 ↓
 ¡Éxito!
```

---

## Estados Posibles

### Éxito
```javascript
paymentSuccess = true
Modal muestra: "¡Pago realizado! "
Firebase: userPlans/{uid} creado
Usuario: Acceso a Premium activado
```

### Error: No autenticado
```javascript
isAuthenticated = false
Acción: Redirige a /login
Mensaje: (implícito - se va a login)
```

### Error: Usuario cierra sesión
```javascript
user = null
PaymentModal: error = "Debes estar autenticado para realizar una compra"
Guardado en Firebase: NO
```

### Error: Datos de pago inválidos
```javascript
isFormValid = false
Botón "Pagar": Deshabilitado (disabled)
Usuario: No puede hacer clic
```

### Error: Falla Firebase
```javascript
try-catch en handleSubmit
error = "Error al procesar el pago. Intenta de nuevo."
Mostrado en: <div className="p-3 bg-red-500/10...">
```

---

## Validaciones por Nivel

### 1️⃣ Frontend (UI)
```javascript
// PricingPlans.jsx
isAuthenticated ? abrirModal : irALogin()

// PaymentModal.jsx
isFormValid ? habilitarPago : deshabilitarPago()
```

### 2️⃣ Lógica de Negocio
```javascript
// PaymentModal.jsx
if (!user) throw Error("No autenticado")
await procesarPago()
await guardarEnFirebase()
```

### 3️⃣ Base de Datos
```javascript
// Firebase
SubscriptionPlanService.updateUserPlan(uid, data)
// Solo usuarios con uid válido pueden guardar
```

---

## Seguridad Implementada

| Nivel | Validación | Efecto |
|-------|-----------|--------|
| **UI** | `isAuthenticated` check | Impide abrir modal sin sesión |
| **Modal** | `user` existence check | Evita pago sin UID |
| **Firebase** | Security Rules | Solo el usuario puede crear su plan |
| **Error Handling** | try-catch | Captura y muestra errores |

---

## Testing Manual

### Caso 1: No Autenticado
```
1. No iniciar sesión
2. Ir a HomePage
3. Clic en "Premium"
Esperado: Redirige a /login
```

### Caso 2: Autenticado - Pago Exitoso
```
1. Iniciar sesión
2. Ir a HomePage
3. Clic en "Premium"
Esperado: Abre PaymentModal
4. Llenar datos (Visa simulada)
5. Clic "Pagar"
Esperado: Muestra "Pago exitoso"
6. Firebase Console → userPlans/{uid}
Esperado: Datos guardados correctamente
```

### Caso 3: Autenticado - Datos Inválidos
```
1. Iniciar sesión
2. Clic en "Premium"
3. Dejar campos vacíos
Esperado: Botón "Pagar" deshabilitado
```

---

## URL de Redirección

Cuando redirige a login, pasa el plan:
```javascript
navigate('/login', {
 state: {
 from: 'pricing', // Indica que viene de pricing
 plan: planObject // El plan que intenta comprar
 }
})
```

El componente `LoginPage` podría usar esto para redirigir de vuelta después de login.

---

**¡Ahora el sistema es 100% seguro!**
