# Tecnologías del proyecto

Este documento describe las tecnologías utilizadas en **WEB-ICFES Master**, tanto en desarrollo como en producción.

---

## Desarrollo

### Framework y UI

| Tecnología        | Versión | Descripción                                              |
| ----------------- | ------- | -------------------------------------------------------- |
| **Next.js**       | 15.1    | Framework React con App Router, SSR y render en servidor |
| **React**         | 19.2    | Biblioteca para construcción de interfaces               |
| **TypeScript**    | 5.9     | Tipado estático (código nuevo y mayoría del repo en TS)  |
| **Redux Toolkit** | 2.5     | Estado UI global (`uiSession`: demo, plan)               |
| **react-redux**   | 9.2     | Bindings de Redux para React                             |

### Estilos y animación

| Tecnología              | Versión | Descripción                              |
| ----------------------- | ------- | ---------------------------------------- |
| **Tailwind CSS**        | 4.2     | Framework CSS utility-first              |
| **tailwind-animations** | 1.0     | Utilidades `animate-*` adicionales       |
| **PostCSS**             | 8.4     | Procesador de CSS con plugin de Tailwind |
| **GSAP**                | 3.14    | Animaciones (modales, reveals, landing)  |
| **@gsap/react**         | 2.1     | Hooks de GSAP para React                 |

### Contenido y matemáticas

| Tecnología         | Versión | Descripción                |
| ------------------ | ------- | -------------------------- |
| **react-markdown** | 10.1    | Renderizado de Markdown    |
| **KaTeX**          | 0.16    | Fórmulas matemáticas       |
| **react-katex**    | 3.1     | Componentes KaTeX en React |

### Calidad de código

| Tecnología            | Versión | Descripción                    |
| --------------------- | ------- | ------------------------------ |
| **ESLint**            | 9.39    | Linter                         |
| **Prettier**          | 3.8     | Formateador                    |
| **Vitest**            | 4.1     | Tests unitarios                |
| **react-doctor**      | 0.1     | Auditoría de patrones React    |
| **markdownlint-cli2** | 0.17    | Lint de documentación Markdown |

### Herramientas

| Tecnología | Descripción                                 |
| ---------- | ------------------------------------------- |
| **pnpm**   | Gestor de paquetes (CI usa pnpm 9, Node 20) |

---

## Producción

### Frontend

| Tecnología       | Descripción                                                           |
| ---------------- | --------------------------------------------------------------------- |
| **Next.js**      | Build de producción (salida en `.next/`); despliegue con `next start` |
| **React**        | Renderizado en cliente y servidor según la ruta                       |
| **Tailwind CSS** | Estilos compilados y optimizados                                      |

### Backend y servicios

| Tecnología   | Versión | Descripción                                         |
| ------------ | ------- | --------------------------------------------------- |
| **Supabase** | 2.49    | Base de datos, autenticación y backend-as-a-service |
| **OpenAI**   | 6.32    | Integración con modelos de IA (`/api/chat`)         |

### Despliegue

| Entorno          | Descripción                                                                     |
| ---------------- | ------------------------------------------------------------------------------- |
| **Vercel**       | Hosting para Next.js (recomendado)                                              |
| **Netlify**      | Hosting con runtime serverless o estático según configuración                   |
| **GitHub Pages** | Solo si se habilita `output: 'export'` en `next.config` (no activo por defecto) |

---

## Resumen por categoría

```text
Desarrollo:  Next.js, React, TypeScript, Redux, Tailwind, GSAP, Vitest, ESLint, Prettier, pnpm
Producción:  Next.js, React, Supabase, OpenAI, Tailwind, react-markdown, KaTeX
```

---

_Archivo generado por IA. Última actualización: miércoles, 27 de mayo de 2026._
