# 🎯 EXECUTIVE SUMMARY - WEB-ICFES Master

## 📌 Tech stack

| Technology       | Use                                    |
| ---------------- | -------------------------------------- |
| **Next.js 15**   | React framework with App Router        |
| **React 19**     | UI library                             |
| **Supabase**     | Backend: Auth, PostgreSQL, persistence |
| **Tailwind CSS** | Styling and design                     |
| **pnpm**         | Package manager                        |

---

## 📚 Main documentation

- **General index:** [docs/en/overview/overview.md](./overview.md)
- **Installation:** [docs/en/setup/installation.md](../setup/installation.md)
- **Configuration:** [docs/en/setup/configuration.md](../setup/configuration.md)

---

## 🚀 Quick start

### Requirements

- Node.js 18+
- pnpm

### Initial setup

```bash
git clone <url-repo>
cd WEB-ICFES-Master
pnpm install
cp .env.example .env.local   # Configure variables
pnpm dev                     # Development server
```

---

## 🗂️ Project structure

```txt
WEB-ICFES-Master/
├── src/
│   ├── app/              # Next.js routes (App Router)
│   ├── features/         # Business modules
│   ├── shared/           # Shared components
│   ├── services/         # Data layer (Supabase, adapters)
│   └── config/           # Supabase, constants
├── docs/                 # Technical documentation (es/en)
├── package.json
└── next.config.ts
```

---

## 📞 Quick commands

```bash
# Development
pnpm dev                   # Local server
pnpm build                 # Production build
pnpm start                 # Production server (after build)
```

---

## ⚠️ Important

- **Environment variables:** Configure `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.

---

_AI-generated file. Last updated: Monday, May 18, 2026._
