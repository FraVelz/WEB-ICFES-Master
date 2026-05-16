# Payment integration summary

> Not implemented: still in development (donations / subscriptions).

## Problem addressed

Users could try to pay without being authenticated → the UID was not available to attach a subscription.

## Intended / partial solution

Documented target flow (may change while the module is under development):

### 1. **PricingPlans** — requires session

- Clicks on a paid plan without auth → **redirect to /login**
- When authenticated → **open payment modal**

### 2. **PaymentModal** — persistence

- Ensures `user.uid` exists (authenticated user).
- Payment processing: simulated in development; production may integrate a provider (e.g. Stripe).
- **Subscription in Supabase:** `user_plans` table (also referenced from `AuthContext` in the current codebase).

### 3. **`pricing.ts`** — plan identifiers

- `id: 'free'`, `id: 'premium'`, `id: 'pro'`
- Used when rendering UI and when persisting to Supabase

---

## Stored data (Supabase)

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

## Main files

1. [`src/shared/components/PricingPlans.tsx`](../../../src/shared/components/PricingPlans.tsx) — auth gate
2. [`src/shared/components/organisms/PaymentModal/PaymentModal.tsx`](../../../src/shared/components/organisms/PaymentModal/PaymentModal.tsx) — payment flow and persistence
3. [`src/features/home/data/pricing.ts`](../../../src/features/home/data/pricing.ts) — plan definitions

---
*AI-generated file. Last updated: Saturday, May 16, 2026.*
