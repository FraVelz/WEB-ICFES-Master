# Project Technologies

This document describes the technologies used in the **Pruebas ICFES** project, for both development and production.

---

## Development

### Framework and UI

| Technology   | Version | Description                                           |
| ------------ | ------- | ----------------------------------------------------- |
| **Next.js**  | 15.1    | React framework with App Router, SSR and static export|
| **React**    | 19.2    | Library for building user interfaces                  |
| **TypeScript** | 5.9   | Statically typed language (project uses TS)            |

### Styling

| Technology     | Version | Description                                            |
| -------------- | ------- | ------------------------------------------------------ |
| **Tailwind CSS** | 4.2   | Utility-first CSS framework for responsive design      |
| **PostCSS**    | 8.4     | CSS processor with Tailwind plugin                     |

### Code quality

| Technology | Version | Description                                         |
| ---------- | ------- | --------------------------------------------------- |
| **ESLint** | 9.39    | Linter for error detection and standards             |
| **Prettier** | 3.8   | Automatic code formatter                             |
| **globals** | 16.5   | Global variable definitions for ESLint (browser, node)|

### Tools

| Technology | Description                          |
| ---------- | ------------------------------------ |
| **pnpm**   | Package manager (alternative to npm/yarn) |

---

## Production

### Frontend

| Technology     | Description                                         |
| -------------- | --------------------------------------------------- |
| **Next.js**    | Generates static export (HTML/CSS/JS) in `out/`     |
| **React**      | Client-side rendering                               |
| **Tailwind CSS** | Compiled and optimized styles                     |

### Backend and services

| Technology       | Version | Description                                      |
| ---------------- | ------- | ------------------------------------------------ |
| **Supabase**     | 2.49    | Database, authentication and backend-as-a-service|
| **OpenAI**       | 6.32    | AI model integration                             |
| **react-markdown** | 10.1  | Markdown content rendering                       |

### Deployment

| Environment   | Description                          |
| ------------- | ------------------------------------ |
| **Vercel**    | Hosting for Next.js (recommended)    |
| **Netlify**   | Static or serverless hosting         |
| **GitHub Pages** | Static hosting (with `output: 'export'`) |

---

## Summary by category

```
Development:  Next.js, React, TypeScript, Tailwind, PostCSS, ESLint, Prettier, globals, pnpm
Production:   Next.js, React, Supabase, OpenAI, Tailwind, react-markdown
```
