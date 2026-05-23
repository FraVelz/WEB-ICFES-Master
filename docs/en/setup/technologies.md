# Project technologies

This document describes the technologies used in **Pruebas ICFES**, for both development and production.

---

## Development

### Framework and UI

| Technology     | Version | Description                                                 |
| -------------- | ------- | ----------------------------------------------------------- |
| **Next.js**    | 15.1    | React framework with App Router, SSR, and server rendering  |
| **React**      | 19.2    | Library for building user interfaces                        |
| **TypeScript** | 5.9     | Static typing (new code and most of the repo is TypeScript) |

### Styling

| Technology       | Version | Description                                       |
| ---------------- | ------- | ------------------------------------------------- |
| **Tailwind CSS** | 4.2     | Utility-first CSS framework for responsive design |
| **PostCSS**      | 8.4     | CSS processor with Tailwind plugin                |

### Code quality

| Technology   | Version | Description                                            |
| ------------ | ------- | ------------------------------------------------------ |
| **ESLint**   | 9.39    | Linter for error detection and standards               |
| **Prettier** | 3.8     | Automatic code formatter                               |
| **globals**  | 16.5    | Global variable definitions for ESLint (browser, node) |

### Tools

| Technology | Description                               |
| ---------- | ----------------------------------------- |
| **pnpm**   | Package manager (alternative to npm/yarn) |

---

## Production

### Frontend

| Technology       | Description                                                             |
| ---------------- | ----------------------------------------------------------------------- |
| **Next.js**      | Production build (output in `.next/`); typical deploy with `next start` |
| **React**        | Client and server rendering depending on the route                      |
| **Tailwind CSS** | Compiled and optimized styles                                           |

### Backend and services

| Technology         | Version | Description                                       |
| ------------------ | ------- | ------------------------------------------------- |
| **Supabase**       | 2.49    | Database, authentication and backend-as-a-service |
| **OpenAI**         | 6.32    | AI model integration                              |
| **react-markdown** | 10.1    | Markdown content rendering                        |

### Deployment

| Environment      | Description                                                                                  |
| ---------------- | -------------------------------------------------------------------------------------------- |
| **Vercel**       | Hosting for Next.js (recommended)                                                            |
| **Netlify**      | Serverless or static hosting depending on setup                                              |
| **GitHub Pages** | Only if `output: 'export'` is enabled in `next.config` (not enabled by default in this repo) |

---

## Summary by category

```text
Development:  Next.js, React, TypeScript, Tailwind, PostCSS, ESLint, Prettier, globals, pnpm
Production:   Next.js, React, Supabase, OpenAI, Tailwind, react-markdown
```

---

_AI-generated file. Last updated: Monday, May 18, 2026._
