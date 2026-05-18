# Guía de estilos

Referencia del sistema de estilos y animaciones del proyecto.

## Stack de estilos

- **Tailwind CSS 4** — utilidades y tema (`@import 'tailwindcss'` en `src/app/globals.css`)
- **`tailwind-animations`** — utilidades `animate-*` adicionales (import en el mismo `globals.css`)
- **GSAP** — animaciones de entrada, modales y blobs decorativos
- **`globals.css`** — paleta semántica y variables en `@theme` (sin keyframes propios de animación UI)

## Archivos principales

| Archivo                 | Propósito                                                                 |
| ----------------------- | ------------------------------------------------------------------------- |
| `src/app/globals.css`   | Tailwind, `tailwind-animations`, tokens `--color-*` en `@theme`, `.hide-scrollbar` |
| `src/lib/gsap.ts`       | Configuración de GSAP y ScrollTrigger                                     |
| `src/styles/global.css` | Reexporta el tema: `@import '../app/globals.css'`                         |

## Paleta y tema (`globals.css`)

Los colores de marca y por área se definen como **aliases** en `@theme` (por ejemplo `--color-app-accent: var(--color-cyan-400)`). Eso genera utilidades Tailwind como `text-app-accent`, `from-subject-lc-from`, `bg-ambient-a/30`, etc.

### Grupos habituales

| Prefijo / uso        | Ejemplos de utilidades | Notas |
| -------------------- | ---------------------- | ----- |
| Marca / foco         | `text-app-accent`, `border-app-ring`, `bg-app-ring/20` | Sustituyen el antiguo uso directo de `cyan-*` en muchos sitios |
| CTA y titulares      | `from-cta-from to-cta-to`, `from-cta-text-start via-cta-text-via to-cta-text-end` | Botones y textos con gradiente (auth, hero) |
| Ambiente (orbes)     | `bg-ambient-a/30`, `bg-ambient-b-strong/30` | Fondos difuminados en auth y home |
| Áreas ICFES          | `from-subject-*-from to-subject-*-to`, `text-subject-lc`, `*-grad-*` en datos de home | Alineados con `AREA_INFO` y datos en `src/features/home/data/`, `roadmapData`, etc. |
| Perfil / stats / nav | `from-stat-*`, `from-nav-*`, `text-profile-*-icon` | Tarjetas de perfil y métricas |
| Lecciones            | `bg-lesson-*-glow-a/20` | Brillos de fondo por materia |
| Home “por qué elegirnos” | `from-feature-N-from to-feature-N-to` | Lista en `src/features/home/data/features.ts` |

La lista completa de tokens está comentada por bloques en `src/app/globals.css`. Para nuevas pantallas, **prefiere estos nombres** a tonos sueltos (`blue-500`, `cyan-400`, …) salvo casos puntuales.

## Animaciones

### Paquete `tailwind-animations`

Definiciones y keyframes vienen del paquete; en componentes se usan clases como:

- `animate-fade-in`, `animate-fade-in-up` — aparición
- `animate-zoom-in` — entrada tipo modal
- Otras: ver documentación del paquete o la lista en su CSS

### Tailwind (núcleo)

Utilidades integradas: `animate-spin`, `animate-pulse`, `animate-bounce`, `animate-ping`, etc.

### GSAP

| Componente / hook        | Uso                                                |
| ------------------------ | -------------------------------------------------- |
| `AnimatedReveal`         | Revelado al scroll o carga (p. ej. home)           |
| `AnimatedOnMount`        | Entrada al montar el componente                    |
| `useGSAPModalEntrance`   | Entrada de modales (`src/hooks/useGSAPModalEntrance.ts`) |
| `GSAPGlowBlob`           | Blobs decorativos con pulso de opacidad            |

Hooks relacionados: `useGSAPReveal` (`src/hooks/useGSAPReveal.ts`), `useGSAPModalEntrance`.

## Colores por área (`AREA_INFO`)

En `src/shared/constants/areaInfo.ts`, el campo `color` usa **gradientes semánticos** (no clases `from-blue-400` sueltas), por ejemplo:

| Área                  | Clases de gradiente (resumen)        |
| --------------------- | ------------------------------------ |
| Lectura Crítica       | `from-subject-lc-from to-subject-lc-to` |
| Matemáticas           | `from-subject-math-from to-subject-math-to` |
| Ciencias Naturales    | `from-subject-sci-from to-subject-sci-to` |
| Sociales y Ciudadanas | `from-subject-soc-from to-subject-soc-to` |
| Inglés                | `from-subject-eng-from to-subject-eng-to` |
| Examen completo       | `from-subject-full-from to-subject-full-to` |

Otros datos (home, ruta de aprendizaje, perfil) reutilizan los mismos tokens donde aplica.

**Estados:** éxito (`green-*`), advertencia (`yellow-*`, `amber-*`), error (`red-*`), además de tokens específicos del tema cuando existan.

## Utilidades CSS

```css
/* Scrollbar oculto */
.hide-scrollbar
```

Animaciones: usar clases `animate-*` de Tailwind o `tailwind-animations` (no hay clase personalizada `.animate-fadeIn` en el proyecto).

## Tema oscuro

La app prioriza tema oscuro: fondos `bg-black`, `bg-slate-950`; texto `text-white`, `text-slate-300`, `text-slate-400`.

## Patrones de componentes

- **Botones:** gradientes `bg-linear-to-r`, `hover:shadow-lg`, `transition-all duration-300`; a menudo `from-cta-from to-cta-to`
- **Cards:** `bg-slate-800/50`, bordes `border-slate-700`, `backdrop-blur-xl`
- **Inputs:** `bg-slate-800/50`, foco `focus:border-app-ring`, `focus:ring-app-ring/30`
- **Badges / progreso:** gradientes por área (tokens `subject-*`), `rounded-xl`, `rounded-full`

## Estructura de clases habitual

- Contenedores: `max-w-7xl mx-auto px-6 md:px-8`
- Espaciado: `py-8`, `gap-4`, `gap-6`
- Título con gradiente: `bg-clip-text text-transparent bg-linear-to-r from-cta-text-start via-cta-text-via to-cta-text-end`

---
*Archivo generado por IA. Última actualización: lunes, 18 de mayo de 2026.*
