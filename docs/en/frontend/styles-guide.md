# Styles Guide

> **Last updated:** March 19, 2025

## Styling Stack

- **Tailwind CSS 4** – Utilities and theme
- **GSAP** – Entrance animations, modals, and blobs
- **globals.css** – Keyframes, utilities, and theme

## Main Files

| File                    | Purpose                              |
| ----------------------- | ------------------------------------ |
| `src/app/globals.css`   | Tailwind theme, keyframes, utilities |
| `src/lib/gsap.ts`       | GSAP and ScrollTrigger config        |
| `src/styles/global.css` | Additional styles                    |

## Theme and Keyframes (globals.css)

The theme defines reusable keyframes:

| Keyframe       | Description                     |
| -------------- | ------------------------------- |
| `fadeIn`       | Opacity 0→1, translateY(20px)→0 |
| `slideInLeft`  | From translateX(-30px)          |
| `slideInRight` | From translateX(30px)           |
| `scaleIn`      | From scale(0.95)                |
| `float`        | Smooth vertical movement (loop) |
| `glow`         | Pulsing box-shadow              |
| `blob`         | Organic movement (loop)         |
| `slideInUp`    | From translateY(40px)           |
| `fadeInScale`  | Opacity + scale(0.95)→1         |

Animation variables in `@theme`:

- `--animate-fadeIn`, `--animate-slideInLeft`, `--animate-slideInRight`
- `--animate-scaleIn`, `--animate-float`, `--animate-glow`, `--animate-blob`

## GSAP Animations

Entrance and modal animations use GSAP:

| Component              | Use                                          |
| ---------------------- | -------------------------------------------- |
| `AnimatedReveal`       | Reveal on scroll or initial load (Home)      |
| `AnimatedOnMount`      | Entrance on mount                            |
| `useGSAPModalEntrance` | Modal entrance (fade, slideUp, slideFromTop) |
| `GSAPGlowBlob`         | Decorative blobs with opacity pulse          |

Hooks: `useGSAPReveal`, `useGSAPModalEntrance`

## Color Palette

**By area (AREA_INFO):**

| Area             | Tailwind gradient               |
| ---------------- | ------------------------------- |
| Reading          | `from-blue-400 to-blue-600`     |
| Mathematics      | `from-green-400 to-green-600`   |
| Natural Sciences | `from-purple-400 to-purple-600` |
| Social Studies   | `from-orange-400 to-orange-600` |
| English          | `from-indigo-400 to-indigo-600` |
| Full Exam        | `from-pink-400 to-pink-600`     |

**Accents:**

- Cyan: `cyan-400`, `cyan-500`
- Blue: `blue-500`, `blue-600`
- Purple: `purple-500`, `purple-600`

**States:**

- Success: `green-400`, `green-500`
- Warning: `yellow-400`, `amber-500`
- Error: `red-400`, `red-500`

## CSS Utilities

```css
/* Hidden scrollbar */
.hide-scrollbar

/* Fade-in animation */
.animate-fadeIn
```

## Dark Mode

The app uses dark theme by default. Main background: `bg-black`, `bg-slate-950`. Text: `text-white`, `text-slate-300`, `text-slate-400`.

## Component Patterns

**Buttons:**

- Gradients: `bg-linear-to-r from-cyan-500 to-blue-600`
- Hover: `hover:shadow-lg`, `hover:scale-105`
- Transitions: `transition-all duration-300`

**Cards:**

- Background: `bg-slate-800/50`, `bg-white/5`
- Borders: `border-slate-700`, `border-cyan-500/20`
- Backdrop: `backdrop-blur-xl`

**Inputs:**

- Background: `bg-slate-800/50`
- Focus: `focus:border-cyan-500`, `focus:ring-2 focus:ring-cyan-500/30`

**Badges and progress:**

- Gradients by area: `bg-linear-to-r ${area.color}`
- Rounded borders: `rounded-xl`, `rounded-full`

## Common Class Structure

- Containers: `max-w-7xl mx-auto px-6 md:px-8`
- Spacing: `py-8`, `py-12`, `gap-4`, `gap-6`
- Text: `text-lg`, `text-slate-300`, `font-bold`
- Text gradients: `bg-clip-text text-transparent bg-linear-to-r from-cyan-400 via-blue-400 to-purple-400`
