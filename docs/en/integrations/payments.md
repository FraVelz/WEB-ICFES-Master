# Payment Integration Summary

> Not implemented: still in development (donations section / subscription section)

## Identified Problem

Users could attempt to pay without being authenticated → UID was lost to attribute the subscription.

## Implemented Solution

Secure and audited flow:

### 1. **PricingPlans** - Requires Login

- If user clicks on a paid plan without being authenticated → **Redirects to /login**
- If authenticated → **Opens payment modal**

### 2. **PaymentModal** - Saves to Supabase

- Verifies that `user.uid` exists (authenticated)
- Processes payment (simulated in development, Stripe in production)
- **Saves subscription to Supabase:** table `user_plans` (or equivalent)
- Shows errors if something fails

### 3. **pricing.ts** - Plan IDs

- `id: 'free'`, `id: 'premium'`, `id: 'pro'`
- Used when saving to Supabase

---

## Saved Data (Supabase)

```txt
user_plans (or userPlans)
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

## Main Files

1. `src/shared/components/PricingPlans.tsx` - Authentication verification
2. `src/shared/components/organisms/PaymentModal/PaymentModal.tsx` - Save to Supabase
3. `src/features/home/data/pricing.ts` - Plan IDs
