# Guía de Estilos

> **Última actualización:** 19 de marzo de 2025

## Stack de Estilos

- **Tailwind CSS 4** – Utilidades y tema
- **GSAP** – Animaciones de entrada, modales y blobs
- **globals.css** – Keyframes, utilidades y tema

## Archivos Principales

| Archivo                 | Propósito                            |
| ----------------------- | ------------------------------------ |
| `src/app/globals.css`   | Tema Tailwind, keyframes, utilidades |
| `src/lib/gsap.ts`       | Configuración GSAP y ScrollTrigger   |
| `src/styles/global.css` | Estilos adicionales                  |

## Tema y Keyframes (globals.css)

El tema define keyframes reutilizables:

| Keyframe       | Descripción                      |
| -------------- | -------------------------------- |
| `fadeIn`       | Opacidad 0→1, translateY(20px)→0 |
| `slideInLeft`  | Desde translateX(-30px)          |
| `slideInRight` | Desde translateX(30px)           |
| `scaleIn`      | Desde scale(0.95)                |
| `float`        | Movimiento vertical suave (loop) |
| `glow`         | Box-shadow pulsante              |
| `blob`         | Movimiento orgánico (loop)       |
| `slideInUp`    | Desde translateY(40px)           |
| `fadeInScale`  | Opacidad + scale(0.95)→1         |

Variables de animación en `@theme`:

- `--animate-fadeIn`, `--animate-slideInLeft`, `--animate-slideInRight`
- `--animate-scaleIn`, `--animate-float`, `--animate-glow`, `--animate-blob`

## Animaciones con GSAP

Las animaciones de entrada y modales usan GSAP:

| Componente             | Uso                                              |
| ---------------------- | ------------------------------------------------ |
| `AnimatedReveal`       | Revelado al scroll o carga inicial (Home)        |
| `AnimatedOnMount`      | Entrada al montar                                |
| `useGSAPModalEntrance` | Entrada de modales (fade, slideUp, slideFromTop) |
| `GSAPGlowBlob`         | Blobs decorativos con pulso de opacidad          |

Hooks: `useGSAPReveal`, `useGSAPModalEntrance`

## Paleta de Colores

**Por área (AREA_INFO):**

| Área                  | Gradiente Tailwind              |
| --------------------- | ------------------------------- |
| Lectura Crítica       | `from-blue-400 to-blue-600`     |
| Matemáticas           | `from-green-400 to-green-600`   |
| Ciencias Naturales    | `from-purple-400 to-purple-600` |
| Sociales y Ciudadanas | `from-orange-400 to-orange-600` |
| Inglés                | `from-indigo-400 to-indigo-600` |
| Examen Completo       | `from-pink-400 to-pink-600`     |

**Acentos:**

- Cyan: `cyan-400`, `cyan-500`
- Azul: `blue-500`, `blue-600`
- Púrpura: `purple-500`, `purple-600`

**Estados:**

- Éxito: `green-400`, `green-500`
- Advertencia: `yellow-400`, `amber-500`
- Error: `red-400`, `red-500`

## Utilidades CSS

```css
/* Scrollbar oculto */
.hide-scrollbar

/* Animación de aparición */
.animate-fadeIn
```

## Dark Mode

La app usa tema oscuro por defecto. Fondo principal: `bg-black`, `bg-slate-950`. Texto: `text-white`, `text-slate-300`, `text-slate-400`.

## Patrones de Componentes

**Botones:**

- Gradientes: `bg-linear-to-r from-cyan-500 to-blue-600`
- Hover: `hover:shadow-lg`, `hover:scale-105`
- Transiciones: `transition-all duration-300`

**Cards:**

- Fondo: `bg-slate-800/50`, `bg-white/5`
- Bordes: `border-slate-700`, `border-cyan-500/20`
- Backdrop: `backdrop-blur-xl`

**Inputs:**

- Fondo: `bg-slate-800/50`
- Focus: `focus:border-cyan-500`, `focus:ring-2 focus:ring-cyan-500/30`

**Badges y progreso:**

- Gradientes por área: `bg-linear-to-r ${area.color}`
- Bordes redondeados: `rounded-xl`, `rounded-full`

## Estructura de Clases Comunes

- Contenedores: `max-w-7xl mx-auto px-6 md:px-8`
- Espaciado: `py-8`, `py-12`, `gap-4`, `gap-6`
- Texto: `text-lg`, `text-slate-300`, `font-bold`
- Gradientes de texto: `bg-clip-text text-transparent bg-linear-to-r from-cyan-400 via-blue-400 to-purple-400`
