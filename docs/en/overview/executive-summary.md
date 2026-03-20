# 🎯 EXECUTIVE SUMMARY - WEB-ICFES Master

## 📌 Tech Stack

| Technology     | Use                                      |
| -------------- | ---------------------------------------- |
| **Next.js 15** | React framework with App Router          |
| **Supabase**   | Backend: Auth, PostgreSQL, persistence    |
| **Tailwind CSS** | Styling and design                      |
| **pnpm**       | Package manager                          |

---

## 📚 Main Documentation

- **General index:** `_docs/DOCUMENTATION.md`
- **Installation:** `_docs/setup/installation.md`
- **Configuration:** `_docs/setup/configuration.md`

---

## 🚀 Quick Start

### Requirements

- Node.js 18+
- pnpm

### Initial Setup

```bash
git clone <url-repo>
cd WEB-ICFES-Master
pnpm install
cp .env.example .env.local   # Configure variables
pnpm dev                     # Development server
```

---

## 🗂️ Project Structure

```txt
WEB-ICFES-Master/
├── src/
│   ├── app/              # Next.js routes (App Router)
│   ├── features/         # Business modules
│   ├── shared/           # Shared components
│   ├── services/         # Data layer (Supabase, adapters)
│   └── config/           # Supabase, constants
├── package.json
├── next.config.ts
└── _docs/
```

---

## 📞 Quick Commands

```bash
# Development
pnpm dev                   # Local server
pnpm build                 # Production build
pnpm start                 # Production preview
```

---

## ⚠️ Important

- **Environment variables:** Configure `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
