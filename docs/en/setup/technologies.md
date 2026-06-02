# Project technologies

This document describes the technologies used in **WEB-ICFES Master**, for both development and production.

---

## Development

### Framework and UI

| Technology        | Version | Description                                             |
| ----------------- | ------- | ------------------------------------------------------- |
| **Next.js**       | 15.1    | React framework with App Router, SSR, and server render |
| **React**         | 19.2    | UI library                                              |
| **TypeScript**    | 5.9     | Static typing (new code and most of the repo in TS)     |
| **Redux Toolkit** | 2.5     | Global UI state (`uiSession`: demo, plan)               |
| **react-redux**   | 9.2     | Redux bindings for React                                |

### Styles and animation

| Technology              | Version | Description                           |
| ----------------------- | ------- | ------------------------------------- |
| **Tailwind CSS**        | 4.2     | Utility-first CSS framework           |
| **tailwind-animations** | 1.0     | Extra `animate-*` utilities           |
| **PostCSS**             | 8.4     | CSS processor with Tailwind plugin    |
| **GSAP**                | 3.14    | Animations (modals, reveals, landing) |
| **@gsap/react**         | 2.1     | GSAP hooks for React                  |

### Content and math

| Technology         | Version | Description               |
| ------------------ | ------- | ------------------------- |
| **react-markdown** | 10.1    | Markdown rendering        |
| **KaTeX**          | 0.16    | Math formulas             |
| **react-katex**    | 3.1     | KaTeX components in React |

### Code quality

| Technology            | Version | Description         |
| --------------------- | ------- | ------------------- |
| **ESLint**            | 9.39    | Linter              |
| **Prettier**          | 3.8     | Formatter           |
| **Vitest**            | 4.1     | Unit tests          |
| **react-doctor**      | 0.1     | React pattern audit |
| **markdownlint-cli2** | 0.17    | Markdown lint       |

### Tools

| Technology | Description                               |
| ---------- | ----------------------------------------- |
| **pnpm**   | Package manager (CI uses pnpm 9, Node 20) |

---

## Production

### Frontend

| Technology       | Description                                                     |
| ---------------- | --------------------------------------------------------------- |
| **Next.js**      | Production build (output in `.next/`); deploy with `next start` |
| **React**        | Client and server rendering per route                           |
| **Tailwind CSS** | Compiled and optimized styles                                   |

### Backend and services

| Technology   | Version | Description                          |
| ------------ | ------- | ------------------------------------ |
| **Supabase** | 2.49    | Database, auth, backend-as-a-service |
| **OpenAI**   | 6.32    | AI models integration (`/api/chat`)  |

### Deployment

| Environment      | Description                                                          |
| ---------------- | -------------------------------------------------------------------- |
| **Vercel**       | Next.js hosting (recommended). Enable **Web Analytics** and **Speed Insights** in the project dashboard after deploy (`@vercel/analytics`, `@vercel/speed-insights` in the root layout) |
| **Netlify**      | Serverless or static hosting depending on config                     |
| **GitHub Pages** | Only if `output: 'export'` is enabled in `next.config` (not default) |

---

## Summary by category

```text
Development: Next.js, React, TypeScript, Redux, Tailwind, GSAP, Vitest, ESLint, Prettier, pnpm
Production:  Next.js, React, Supabase, OpenAI, Tailwind, react-markdown, KaTeX
```

---

_AI-generated file. Last updated: Wednesday, May 27, 2026._
