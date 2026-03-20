# Tecnologías del Proyecto

Este documento describe las tecnologías utilizadas en el proyecto **Pruebas ICFES**, tanto para desarrollo como para producción.

---

## Desarrollo

### Framework y UI

| Tecnología     | Versión | Descripción                                            |
| -------------- | ------- | ------------------------------------------------------ |
| **Next.js**    | 15.1    | Framework React con App Router, SSR y export estático  |
| **React**      | 19.2    | Biblioteca para construcción de interfaces de usuario  |
| **TypeScript** | 5.9     | Lenguaje con tipado estático (el proyecto usa JS y TS) |

### Estilos

| Tecnología       | Versión | Descripción                                           |
| ---------------- | ------- | ----------------------------------------------------- |
| **Tailwind CSS** | 4.2     | Framework de CSS utility-first para diseño responsive |
| **PostCSS**      | 8.4     | Procesador de CSS con plugin de Tailwind              |

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

| Tecnología       | Descripción                                            |
| ---------------- | ------------------------------------------------------ |
| **Next.js**      | Genera export estático (HTML/CSS/JS) en carpeta `out/` |
| **React**        | Renderizado del cliente                                |
| **Tailwind CSS** | Estilos compilados y optimizados                       |

### Backend y servicios

| Tecnología         | Versión | Descripción                                         |
| ------------------ | ------- | --------------------------------------------------- |
| **Supabase**       | 2.49    | Base de datos, autenticación y backend-as-a-service |
| **OpenAI**         | 6.32    | Integración con modelos de IA                       |
| **react-markdown** | 10.1    | Renderizado de contenido Markdown                   |

### Despliegue

| Entorno          | Descripción                               |
| ---------------- | ----------------------------------------- |
| **Vercel**       | Hosting para Next.js (recomendado)        |
| **Netlify**      | Hosting estático o serverless             |
| **GitHub Pages** | Hosting estático (con `output: 'export'`) |

---

## Resumen por categoría

```
Desarrollo:  Next.js, React, TypeScript, Tailwind, PostCSS, ESLint, Prettier, globals, pnpm
Producción:  Next.js, React, Supabase, OpenAI, Tailwind, react-markdown
```
