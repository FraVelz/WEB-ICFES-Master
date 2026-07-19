# ADR: Billing disabled in 2026

**Status:** Accepted  
**Date:** 2026-07-15  
**Decision:** D2

## Context

The product once envisioned Free/Pro/Premium plans and subscription services (`SubscriptionPlanService`). That does not improve credibility in the 0–30 day phase while the question bank and per-area practice are still the priority.

## Decision

- `BILLING_ENABLED=false` / `NEXT_PUBLIC_BILLING_ENABLED=false` by default.
- No live Free/Pro/Premium product in the app for 2026.
- The coin shop (cosmetic items / streak shields) is not subscription billing.
- Voluntary donations may exist as project support; they are not a paid plan.

## Consequences

- No dead “upgrade to Pro/Premium” CTAs.
- Docs no longer treat `services/store/` / `SubscriptionPlanService` as live code.
- Re-enabling billing requires an explicit flag plus a real plans/payments implementation.

See also: [configuration.md](../setup/configuration.md).
