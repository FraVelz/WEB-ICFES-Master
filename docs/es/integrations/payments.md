# Resumen: integración de pagos

> No implementado: aún en desarrollo (donaciones / suscripciones).

## Problema Identificado

Usuarios podían intentar pagar sin estar autenticados → Se perdía el UID para atribuir la suscripción.

## Solución prevista / parcial

Flujo documentado como objetivo (puede variar mientras el módulo está en desarrollo):

### 1. **PricingPlans** — requiere sesión

- Si hace clic en un plan de pago sin estar autenticado → **Redirige a /login**
- Si está autenticado → **Abre modal de pago**

### 2. **PaymentModal** — persistencia

- Comprueba que exista `user.uid` (usuario autenticado).
- Procesamiento del pago: simulado en desarrollo; en producción se puede enlazar con un proveedor (p. ej. Stripe).
- **Suscripción en Supabase:** tabla `user_plans` (usada también desde `AuthContext` en el código actual).

### 3. **`pricing.ts`** — identificadores de planes

- `id: 'free'`, `id: 'premium'`, `id: 'pro'`
- Se usan al preparar la UI y al persistir en Supabase

---

## Datos Guardados (Supabase)

```txt
user_plans
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

## Archivos principales

1. [`src/shared/components/PricingPlans.tsx`](../../../src/shared/components/PricingPlans.tsx) — comprobación de autenticación
2. [`src/shared/components/organisms/PaymentModal/PaymentModal.tsx`](../../../src/shared/components/organisms/PaymentModal/PaymentModal.tsx) — flujo de pago y persistencia
3. [`src/features/home/data/pricing.ts`](../../../src/features/home/data/pricing.ts) — definición de planes

---
*Archivo generado por IA. Última actualización: sábado, 16 de mayo de 2026.*
