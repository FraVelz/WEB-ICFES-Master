# Resumen: integración de pagos

> No implementado por completo: donaciones en home y planes en tienda siguen en desarrollo.

## Problema identificado

Usuarios podían intentar pagar sin estar autenticados → se perdía el UID para atribuir la suscripción.

## Estado actual del código

Los componentes legacy **`PricingPlans`** y **`PaymentModal`** (en `shared/organisms/`) fueron **eliminados** en la refactorización de arquitectura.

### Flujos vigentes

| Área | Ubicación | Notas |
| ---- | --------- | ----- |
| Donaciones | `src/features/home/components/DonationSection/` | Formulario simulado en landing |
| Planes / tienda | `src/features/store/` + `src/services/store/` | `SubscriptionPlanService`, `PlanScheduleService` |
| Sesión y plan UI | `src/context/AuthContext.tsx`, Redux `uiSession` | Plan seleccionado y modo demo |
| Persistencia | `@/services/persistence`, tabla `user_plans` en Supabase | Según `API_CONFIG.MODE` |

### Identificadores de plan

Los planes de UI usan ids como `free`, `premium`, `pro` (ver `src/store/types/uiPlan.ts` y servicios en `src/services/store/`).

---

## Datos en Supabase (objetivo)

```txt
user_plans
├── user_id (uuid)
├── plan_type
├── plan_name
├── status
├── price
├── billing_period
├── purchase_date
└── next_billing_date
```

---

## Archivos principales

1. [`src/features/home/components/DonationSection/`](../../../src/features/home/components/DonationSection/) — donaciones en home
2. [`src/features/store/components/StoreModal.tsx`](../../../src/features/store/components/StoreModal.tsx) — tienda en dashboard
3. [`src/services/store/SubscriptionPlanService.ts`](../../../src/services/store/SubscriptionPlanService.ts) — plan en localStorage / stub
4. [`src/context/AuthContext.tsx`](../../../src/context/AuthContext.tsx) — `getUserPlan`, `updateUserPlan`

---
*Archivo generado por IA. Última actualización: lunes, 18 de mayo de 2026.*
