# Installation

Step-by-step guide to configure the project's local environment.

---

## Requirements

| Tool     | Minimum version |
| -------- | --------------- |
| **Node.js** | 18+          |
| **pnpm**   | 8+            |

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
# Supabase (required for production mode)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...

# Data mode: 'supabase' | 'localStorage'
NEXT_PUBLIC_API_MODE=supabase

# OpenAI (optional, for chat assistant)
OPENAI_API_KEY=sk-...
```

For development without backend, use `NEXT_PUBLIC_API_MODE=localStorage`.

### 4. Start development server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Verification

- `pnpm build` should complete without errors
- With `NEXT_PUBLIC_API_MODE=localStorage` the app works without Supabase
- With `NEXT_PUBLIC_API_MODE=supabase` you need a configured Supabase project
