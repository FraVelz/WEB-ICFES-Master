# Environment configuration

Environment variables and runtime modes. For first-time setup, see [installation.md](./installation.md).

---

## Environment variables

Copy [`.env.example`](../../../.env.example) to `.env.local` at the project root.

| Variable                        | Required                  | Description                                                                   |
| ------------------------------- | ------------------------- | ----------------------------------------------------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`      | Yes                       | Supabase project URL                                                          |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes                       | Supabase public anon key                                                      |
| `BILLING_ENABLED`               | No (default `false`)      | Free/Pro/Premium plans product; keep off in 2026                              |
| `NEXT_PUBLIC_BILLING_ENABLED`   | No (default `false`)      | Same flag for client bundles                                                  |
| `OPENAI_ENABLED`                | No (default `false`)      | Enables the AI assistant on the server; also requires `OPENAI_API_KEY`        |
| `NEXT_PUBLIC_OPENAI_ENABLED`    | No (default `false`)      | Client build flag (optional; mounts resolve via server `isOpenAIEnabled()`)   |
| `OPENAI_API_KEY`                | No                        | OpenAI API key for `/api/chat` (assistant stays off without a key)            |
| `NEXT_PUBLIC_SITE_URL`          | Recommended in production | Public origin for `metadataBase`, sitemap, Open Graph, and canonical URLs     |
| `NEXT_PUBLIC_TWITTER_SITE`      | No                        | Twitter/X handle (`@icfesmaster`) for `twitter:site` metadata                 |
| `KV_REST_API_URL`               | Recommended in production | Upstash/Vercel KV REST URL for distributed rate limits and chat daily quota   |
| `KV_REST_API_TOKEN`             | Recommended in production | KV token; without it limits are in-memory per serverless instance             |

### Feature flags (billing and OpenAI)

Helpers in `src/config/featureFlags.ts`:

- **`isBillingEnabled()`** — false by default. No live Free/Pro/Premium (ADR:
  [billing-no-2026.md](../decisions/billing-no-2026.md)).
- **`isOpenAIEnabled()`** — true only when the flag is truthy **and** `OPENAI_API_KEY` is set. Without flag or key,
  the chat launcher is not mounted and `/api/chat` returns 503.

### API rate limiting

Without `KV_REST_API_*`, `src/utils/rateLimit.ts` and `src/services/chat/chatQuotaServer.ts` fall back to in-memory or cookie counters per instance. Configure KV in production for global limits on:

- `/api/chat`
- `/api/demo/session`
- `/api/exam/questions` and `/api/exam/grade`
- `/api/gamification/*`
- `/api/profile/public/[userId]`
- `/api/r2/infographic/[id]`

When vars are missing in `NODE_ENV=production`, `src/instrumentation.ts` logs a warning on Node server startup.

**Local development** does not require KV: the in-memory fallback is enough for day-to-day work.

### Public SEO metadata

- **`NEXT_PUBLIC_SITE_URL`:** used by `getSiteUrl()` in `src/config/site.ts` for `metadataBase`, `robots.ts`, `sitemap.ts`, and Open Graph. On Vercel, if unset, it is inferred from `VERCEL_URL` / `VERCEL_PROJECT_PRODUCTION_URL`.
- **`NEXT_PUBLIC_TWITTER_SITE`:** optional; when set, adds `twitter:site` in the root layout (`src/app/layout.tsx`).

Without `NEXT_PUBLIC_SITE_URL` in production with a custom domain, absolute URLs may point at the `.vercel.app` host instead of the canonical domain.

Without Supabase env vars, login/signup and account persistence will not work. **Demo mode** (from the landing page) still uses local browser storage without an account.

### Supabase Auth (OAuth and password reset)

In **Supabase Dashboard → Authentication → URL Configuration**:

- **Site URL:** `http://localhost:3000` (or your domain)
- **Redirect URLs:**
  - `http://localhost:3000/auth/callback`
  - `http://localhost:3000/auth/callback?next=/ruta-aprendizaje`
  - `http://localhost:3000/reset-password`
  - `https://your-domain.com/auth/callback`

---

## Next.js

| Option               | Value  | Effect                                    |
| -------------------- | ------ | ----------------------------------------- |
| `trailingSlash`      | `true` | Public URLs end with `/` (e.g. `/login/`) |
| `images.unoptimized` | `true` | Images without Next Image optimization    |

Permanent redirect: `/aprendizaje` → `/ruta-aprendizaje` (see `next.config.ts`).

---

## Demo mode

From the landing page, users can enter **demo mode** without an account. State lives in Zustand (`uiSession.demoMode`).
See [services-api.md](../backend/services-api.md) and `src/features/home/utils/enterDemoMode.ts`.

---

_AI-generated file. Last updated: Wednesday, May 27, 2026._
