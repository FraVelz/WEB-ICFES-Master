# Guía de estilos

Referencia del sistema de estilos y animaciones del proyecto.

## Stack de estilos

- **Tailwind CSS 4** — utilidades y tema (`@import 'tailwindcss'` en `src/app/globals.css`)
- **GSAP** — animaciones de entrada, modales y blobs
- **`globals.css`** — keyframes del tema y variables en `@theme`

## Archivos principales

| Archivo                 | Propósito                              |
| ----------------------- | -------------------------------------- |
| `src/app/globals.css`   | Tema Tailwind, keyframes, utilidades   |
| `src/lib/gsap.ts`      | Configuración de GSAP y ScrollTrigger  |
| `src/styles/global.css` | Estilos globales adicionales            |

## Tema y keyframes (`globals.css`)

| Keyframe       | Descripción                      |
| -------------- | -------------------------------- |
| `fadeIn`       | Opacidad 0→1, translateY(20px)→0 |
| `slideInLeft`  | Desde translateX(-30px)          |
| `slideInRight` | Desde translateX(30px)           |
| `scaleIn`      | Desde scale(0.95)                |
| `float`        | Movimiento vertical suave (bucle) |
| `glow`         | Box-shadow pulsante               |
| `blob`         | Movimiento orgánico (bucle)       |
| `slideInUp`    | Desde translateY(40px)            |
| `fadeInScale`  | Opacidad + scale(0.95)→1          |

Variables de animación en `@theme`:

- `--animate-fadeIn`, `--animate-slideInLeft`, `--animate-slideInRight`
- `--animate-scaleIn`, `--animate-float`, `--animate-glow`, `--animate-blob`

## Animaciones con GSAP

| Componente / hook        | Uso                                                |
| ------------------------ | -------------------------------------------------- |
| `AnimatedReveal`         | Revelado al scroll o carga (p. ej. home)           |
| `AnimatedOnMount`        | Entrada al montar el componente                    |
| `useGSAPModalEntrance`   | Entrada de modales (`src/hooks/useGSAPModalEntrance.ts`) |
| `GSAPGlowBlob`           | Blobs decorativos con pulso de opacidad            |

Hooks relacionados: `useGSAPReveal` (`src/hooks/useGSAPReveal.ts`), `useGSAPModalEntrance`.

## Paleta de colores

**Por área (`AREA_INFO` en `src/shared/constants/areaInfo.ts`):**

| Área                  | Gradiente Tailwind              |
| --------------------- | ------------------------------- |
| Lectura Crítica       | `from-blue-400 to-blue-600`     |
| Matemáticas           | `from-green-400 to-green-600`   |
| Ciencias Naturales    | `from-purple-400 to-purple-600` |
| Sociales y Ciudadanas | `from-orange-400 to-orange-600` |
| Inglés                | `from-indigo-400 to-indigo-600` |
| Examen completo       | `from-pink-400 to-pink-600`     |

**Acentos:** cyan, azul, púrpura (`cyan-400`, `blue-500`, `purple-500`, etc.).

**Estados:** éxito (`green-*`), advertencia (`yellow-*`, `amber-*`), error (`red-*`).

## Utilidades CSS

```css
/* Scrollbar oculto */
.hide-scrollbar

/* Animación de aparición */
.animate-fadeIn
```

## Tema oscuro

La app prioriza tema oscuro: fondos `bg-black`, `bg-slate-950`; texto `text-white`, `text-slate-300`, `text-slate-400`.

## Patrones de componentes

- **Botones:** gradientes `bg-linear-to-r`, `hover:shadow-lg`, `transition-all duration-300`
- **Cards:** `bg-slate-800/50`, bordes `border-slate-700`, `backdrop-blur-xl`
- **Inputs:** `bg-slate-800/50`, foco `focus:border-cyan-500`, `focus:ring-cyan-500/30`
- **Badges / progreso:** gradientes por área, `rounded-xl`, `rounded-full`

## Estructura de clases habitual

- Contenedores: `max-w-7xl mx-auto px-6 md:px-8`
- Espaciado: `py-8`, `gap-4`, `gap-6`
- Título con gradiente: `bg-clip-text text-transparent bg-linear-to-r from-cyan-400 via-blue-400 to-purple-400`

---
*Archivo generado por IA. Última actualización: sábado, 16 de mayo de 2026.*
