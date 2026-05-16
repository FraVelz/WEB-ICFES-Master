# Styles guide

Reference for styling and animation conventions in the project.

## Styling stack

- **Tailwind CSS 4** — utilities and theme (`@import 'tailwindcss'` in `src/app/globals.css`)
- **GSAP** — entrance animations, modals, and blobs
- **`globals.css`** — theme keyframes and `@theme` variables

## Main files

| File                    | Purpose                               |
| ----------------------- | ------------------------------------- |
| `src/app/globals.css`   | Tailwind theme, keyframes, utilities  |
| `src/lib/gsap.ts`       | GSAP and ScrollTrigger setup          |
| `src/styles/global.css` | Additional global styles              |

## Theme and keyframes (`globals.css`)

| Keyframe       | Description                     |
| -------------- | ------------------------------- |
| `fadeIn`       | Opacity 0→1, translateY(20px)→0 |
| `slideInLeft`  | From translateX(-30px)          |
| `slideInRight` | From translateX(30px)           |
| `scaleIn`      | From scale(0.95)                |
| `float`        | Smooth vertical motion (loop)   |
| `glow`         | Pulsing box-shadow              |
| `blob`         | Organic motion (loop)           |
| `slideInUp`    | From translateY(40px)          |
| `fadeInScale`  | Opacity + scale(0.95)→1         |

Animation variables in `@theme`:

- `--animate-fadeIn`, `--animate-slideInLeft`, `--animate-slideInRight`
- `--animate-scaleIn`, `--animate-float`, `--animate-glow`, `--animate-blob`

## GSAP animations

| Component / hook       | Use                                                  |
| ---------------------- | ---------------------------------------------------- |
| `AnimatedReveal`       | Reveal on scroll or initial load (e.g. home)         |
| `AnimatedOnMount`      | Entrance on component mount                          |
| `useGSAPModalEntrance` | Modal timing (`src/hooks/useGSAPModalEntrance.ts`)   |
| `GSAPGlowBlob`         | Decorative blobs with opacity pulse                  |

Related hooks: `useGSAPReveal` (`src/hooks/useGSAPReveal.ts`), `useGSAPModalEntrance`.

## Color palette

**By area (`AREA_INFO` in `src/shared/constants/areaInfo.ts`):**

| Area             | Tailwind gradient               |
| ---------------- | ------------------------------- |
| Reading          | `from-blue-400 to-blue-600`     |
| Mathematics      | `from-green-400 to-green-600`   |
| Natural sciences | `from-purple-400 to-purple-600` |
| Social studies   | `from-orange-400 to-orange-600`   |
| English          | `from-indigo-400 to-indigo-600`   |
| Full exam        | `from-pink-400 to-pink-600`       |

**Accents:** cyan, blue, purple (`cyan-400`, `blue-500`, `purple-500`, etc.).

**States:** success (`green-*`), warning (`yellow-*`, `amber-*`), error (`red-*`).

## CSS utilities

```css
/* Hidden scrollbar */
.hide-scrollbar

/* Fade-in utility */
.animate-fadeIn
```

## Dark theme

The UI is dark-first: backgrounds `bg-black`, `bg-slate-950`; text `text-white`, `text-slate-300`, `text-slate-400`.

## Component patterns

- **Buttons:** `bg-linear-to-r` gradients, `hover:shadow-lg`, `transition-all duration-300`
- **Cards:** `bg-slate-800/50`, borders `border-slate-700`, `backdrop-blur-xl`
- **Inputs:** `bg-slate-800/50`, focus `focus:border-cyan-500`, `focus:ring-cyan-500/30`
- **Badges / progress:** area gradients, `rounded-xl`, `rounded-full`

## Typical class structure

- Containers: `max-w-7xl mx-auto px-6 md:px-8`
- Spacing: `py-8`, `gap-4`, `gap-6`
- Gradient text: `bg-clip-text text-transparent bg-linear-to-r from-cyan-400 via-blue-400 to-purple-400`

---
*AI-generated file. Last updated: Saturday, May 16, 2026.*
