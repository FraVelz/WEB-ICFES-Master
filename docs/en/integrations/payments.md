# Payments integration summary

> Not fully implemented: home donations and store plans are still in development.

## Problem identified

Users could attempt to pay without being authenticated → the UID was lost for subscription attribution.

## Current code state

Legacy components **`PricingPlans`** and **`PaymentModal`** (under `shared/organisms/`) were **removed** during the architecture refactor.

### Active flows

| Area | Location | Notes |
| ---- | -------- | ----- |
| Donations | `src/features/home/components/DonationSection/` | Simulated form on the landing page |
| Plans / shop | `src/features/store/` + `src/services/store/` | `SubscriptionPlanService`, `PlanScheduleService` |
| Session and plan UI | `src/context/AuthContext.tsx`, Redux `uiSession` | Selected plan and demo mode |
| Persistence | `@/services/persistence`, Supabase `user_plans` table | Per `API_CONFIG.MODE` |

### Plan identifiers

UI plans use ids such as `free`, `premium`, `pro` (see `src/store/types/uiPlan.ts` and `src/services/store/`).

---

## Supabase data (target)

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

## Main files

1. [`src/features/home/components/DonationSection/`](../../../src/features/home/components/DonationSection/) — home donations
2. [`src/features/store/components/StoreModal.tsx`](../../../src/features/store/components/StoreModal.tsx) — dashboard shop
3. [`src/services/store/SubscriptionPlanService.ts`](../../../src/services/store/SubscriptionPlanService.ts) — plan stub / localStorage
4. [`src/context/AuthContext.tsx`](../../../src/context/AuthContext.tsx) — `getUserPlan`, `updateUserPlan`

---
*AI-generated file. Last updated: Monday, May 18, 2026.*
