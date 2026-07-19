# Installation

Step-by-step guide to configure the project's local environment.

---

## Requirements

| Tool        | Minimum version |
| ----------- | --------------- |
| **Node.js** | 18+             |
| **pnpm**    | 8+              |

```bash
node -v   # Verify Node
pnpm -v   # Install: npm install -g pnpm
```

---

## Steps

### 1. Clone the repository

```bash
git clone <url-repo>
cd WEB-ICFES-Master
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Configure environment variables

Create `.env.local` in the project root:

```bash
# Supabase (required for login and account data)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...

# OpenAI chat (optional; requires OPENAI_ENABLED=true and OPENAI_API_KEY)
OPENAI_ENABLED=false
NEXT_PUBLIC_OPENAI_ENABLED=false
OPENAI_API_KEY=sk-...

# Billing / Free-Pro-Premium (keep false in 2026)
BILLING_ENABLED=false
NEXT_PUBLIC_BILLING_ENABLED=false
```

To try the app without an account, use **demo mode** from the landing page (no Supabase required for the demo session).

The AI assistant only appears when `OPENAI_ENABLED=true` **and** `OPENAI_API_KEY` is set. Paid plans are not active in 2026 (see [billing-no-2026.md](../decisions/billing-no-2026.md)).

### 4. Start development server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Verification

- `pnpm build` should complete without errors
- With Supabase configured, login/signup and account data persist in PostgreSQL
- Demo mode works without an account (local progress in the browser)

See [configuration.md](./configuration.md) for full variable details.

---

_AI-generated file. Last updated: Wednesday, May 27, 2026._
