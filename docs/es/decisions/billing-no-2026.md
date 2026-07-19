# ADR: Billing desactivado en 2026

**Estado:** Aceptada  
**Fecha:** 2026-07-15  
**Decisión:** D2

## Contexto

El producto contemplaba planes Free/Pro/Premium y servicios de suscripción (`SubscriptionPlanService`). Eso no aporta credibilidad en la fase 0–30 mientras el banco de preguntas y la práctica por área no estén sólidos.

## Decisión

- `BILLING_ENABLED=false` / `NEXT_PUBLIC_BILLING_ENABLED=false` por defecto.
- No hay producto live Free/Pro/Premium en la app en 2026.
- La tienda de monedas (ítems cosméticos / protectores) no es billing de suscripción.
- Donaciones voluntarias pueden existir como apoyo al proyecto; no son un plan de pago.

## Consecuencias

- Sin CTAs muertos de “upgrade a Pro/Premium”.
- Docs ya no documentan `services/store/` / `SubscriptionPlanService` como código vivo.
- Reactivar billing exige flag explícito + implementación real de planes/pagos.

Ver también: [configuration.md](../setup/configuration.md).
