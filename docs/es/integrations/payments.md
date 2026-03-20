# Resumen: Integración de Pagos

> No implementado: aun en desarrollo (apartado de donaciones / apartado de suscripcion)

## Problema Identificado

Usuarios podían intentar pagar sin estar autenticados → Se perdía el UID para atribuir la suscripción.

## Solución Implementada

Flujo seguro y auditado:

### 1. **PricingPlans** - Requiere Login

- Si hace clic en un plan de pago sin estar autenticado → **Redirige a /login**
- Si está autenticado → **Abre modal de pago**

### 2. **PaymentModal** - Guarda en Supabase

- Verifica que `user.uid` exista (autenticado)
- Procesa el pago (simulado en desarrollo, Stripe en producción)
- **Guarda la suscripción en Supabase:** tabla `user_plans` (o equivalente)
- Muestra errores si algo falla

### 3. **pricing.js** - IDs de Planes

- `id: 'free'`, `id: 'premium'`, `id: 'pro'`
- Se usa al guardar en Supabase

---

## Datos Guardados (Supabase)

```txt
user_plans (o userPlans)
├── user_id (uuid)
├── plan_type: "premium"
├── plan_name: "Premium"
├── status: "active"
├── price: 1800
├── billing_period: "monthly"
├── purchase_date
└── next_billing_date
```

---

## Archivos Principales

1. `src/shared/components/PricingPlans.tsx` - Verificación de autenticación
2. `src/shared/components/organisms/PaymentModal/PaymentModal.tsx` - Guardar en Supabase
3. `src/features/home/data/pricing.js` - IDs de planes
