# Tecnologías del proyecto

Este documento describe las tecnologías utilizadas en **Pruebas ICFES**, tanto en desarrollo como en producción.

---

## Desarrollo

### Framework y UI

| Tecnología     | Versión | Descripción                                                        |
| -------------- | ------- | ------------------------------------------------------------------ |
| **Next.js**    | 15.1    | Framework React con App Router, SSR y render en servidor           |
| **React**      | 19.2    | Biblioteca para construcción de interfaces                         |
| **TypeScript** | 5.9     | Tipado estático (el código nuevo y la mayoría del repo está en TS) |

### Estilos

| Tecnología       | Versión | Descripción                                        |
| ---------------- | ------- | -------------------------------------------------- |
| **Tailwind CSS** | 4.2     | Framework CSS utility-first para diseño responsive |
| **PostCSS**      | 8.4     | Procesador de CSS con plugin de Tailwind           |

### Calidad de código

| Tecnología   | Versión | Descripción                                                    |
| ------------ | ------- | -------------------------------------------------------------- |
| **ESLint**   | 9.39    | Linter para detectar errores y mantener estándares             |
| **Prettier** | 3.8     | Formateador de código automático                               |
| **globals**  | 16.5    | Definiciones de variables globales para ESLint (browser, node) |

### Herramientas

| Tecnología | Descripción                                 |
| ---------- | ------------------------------------------- |
| **pnpm**   | Gestor de paquetes (alternativa a npm/yarn) |

---

## Producción

### Frontend

| Tecnología       | Descripción                                                                  |
| ---------------- | ---------------------------------------------------------------------------- |
| **Next.js**      | Build de producción (salida en `.next/`); despliegue típico con `next start` |
| **React**        | Renderizado en cliente y servidor según la ruta                              |
| **Tailwind CSS** | Estilos compilados y optimizados                                             |

### Backend y servicios

| Tecnología         | Versión | Descripción                                         |
| ------------------ | ------- | --------------------------------------------------- |
| **Supabase**       | 2.49    | Base de datos, autenticación y backend-as-a-service |
| **OpenAI**         | 6.32    | Integración con modelos de IA                       |
| **react-markdown** | 10.1    | Renderizado de contenido Markdown                   |

### Despliegue

| Entorno          | Descripción                                                                                              |
| ---------------- | -------------------------------------------------------------------------------------------------------- |
| **Vercel**       | Hosting para Next.js (recomendado)                                                                       |
| **Netlify**      | Hosting con runtime serverless o estático según configuración                                            |
| **GitHub Pages** | Solo aplica si se habilita `output: 'export'` en `next.config` (no está activo por defecto en este repo) |

---

## Resumen por categoría

```text
Desarrollo:  Next.js, React, TypeScript, Tailwind, PostCSS, ESLint, Prettier, globals, pnpm
Producción:  Next.js, React, Supabase, OpenAI, Tailwind, react-markdown
```

---

_Archivo generado por IA. Última actualización: lunes, 18 de mayo de 2026._
