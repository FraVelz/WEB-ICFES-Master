# Styles guide

Reference for styling and animation conventions in the project.

## Styling stack

- **Tailwind CSS 4** — utilities and theme (`@import 'tailwindcss'` in `src/app/globals.css`)
- **`tailwind-animations`** — extra `animate-*` utilities (imported in the same `globals.css`)
- **GSAP** — entrance animations, modals, and decorative blobs
- **`globals.css`** — semantic palette and `@theme` variables (no custom UI animation keyframes)

## Main files

| File                    | Purpose                                                                            |
| ----------------------- | ---------------------------------------------------------------------------------- |
| `src/app/globals.css`   | Tailwind, `tailwind-animations`, `--color-*` tokens in `@theme`, `.hide-scrollbar` |
| `src/lib/gsap.ts`       | GSAP and ScrollTrigger setup                                                       |
| `src/styles/global.css` | Re-exports the theme: `@import '../app/globals.css'`                               |

## Palette and theme (`globals.css`)

Brand and subject colors are defined as **aliases** in `@theme` (e.g. `--color-app-accent: var(--color-cyan-400)`). That
yields Tailwind utilities such as `text-app-accent`, `from-subject-lc-from`, `bg-ambient-a/30`, etc.

### Common groups

| Prefix / use          | Example utilities                                                                 | Notes                                                                                  |
| --------------------- | --------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| Brand / focus         | `text-app-accent`, `border-app-ring`, `bg-app-ring/20`                            | Replaces much of the old direct `cyan-*` usage                                         |
| CTAs and headings     | `from-cta-from to-cta-to`, `from-cta-text-start via-cta-text-via to-cta-text-end` | Buttons and gradient text (auth, hero)                                                 |
| Ambient (blobs)       | `bg-ambient-a/30`, `bg-ambient-b-strong/30`                                       | Blurred backgrounds on auth and home                                                   |
| ICFES subject areas   | `from-subject-*-from to-subject-*-to`, `text-subject-lc`, `*-grad-*` in home data | Aligned with `AREA_INFO` and data under `src/features/home/data/`, `roadmapData`, etc. |
| Profile / stats / nav | `from-stat-*`, `from-nav-*`, `text-profile-*-icon`                                | Profile cards and metrics                                                              |
| Lessons               | `bg-lesson-*-glow-a/20`                                                           | Lesson background glows by subject                                                     |
| Home “why choose us”  | `from-feature-N-from to-feature-N-to`                                             | List in `src/features/home/data/features.ts`                                           |

The full token list is grouped and commented in `src/app/globals.css`. For new screens, **prefer these names** over raw
scales (`blue-500`, `cyan-400`, …) unless there is a good local reason.

## Animations

### `tailwind-animations` package

Definitions and keyframes come from the package; components use classes such as:

- `animate-fade-in`, `animate-fade-in-up` — fade / entrance
- `animate-zoom-in` — modal-style entrance
- Others: see the package docs or its CSS

### Tailwind (core)

Built-in utilities: `animate-spin`, `animate-pulse`, `animate-bounce`, `animate-ping`, etc.

### GSAP

| Component / hook       | Use                                                |
| ---------------------- | -------------------------------------------------- |
| `AnimatedReveal`       | Reveal on scroll or initial load (e.g. home)       |
| `AnimatedOnMount`      | Entrance on component mount                        |
| `useGSAPModalEntrance` | Modal timing (`src/hooks/useGSAPModalEntrance.ts`) |
| `GSAPGlowBlob`         | Decorative blobs with opacity pulse                |

Related hooks: `useGSAPReveal` (`src/hooks/useGSAPReveal.ts`), `useGSAPModalEntrance`.

## Colors by area (`AREA_INFO`)

In `src/shared/constants/areaInfo.ts`, the `color` field uses **semantic gradients** (not loose `from-blue-400`
classes), for example:

| Area             | Gradient classes (summary)                  |
| ---------------- | ------------------------------------------- |
| Critical reading | `from-subject-lc-from to-subject-lc-to`     |
| Mathematics      | `from-subject-math-from to-subject-math-to` |
| Natural sciences | `from-subject-sci-from to-subject-sci-to`   |
| Social studies   | `from-subject-soc-from to-subject-soc-to`   |
| English          | `from-subject-eng-from to-subject-eng-to`   |
| Full exam        | `from-subject-full-from to-subject-full-to` |

Other data (home, learning roadmap, profile) reuses the same tokens where appropriate.

**States:** success (`green-*`), warning (`yellow-*`, `amber-*`), error (`red-*`), plus theme tokens where they exist.

## CSS utilities

```css
/* Hidden scrollbar */
.hide-scrollbar
```

Animations: use Tailwind or `tailwind-animations` `animate-*` classes (there is no custom `.animate-fadeIn` in the
project).

## Dark theme

The UI is dark-first: backgrounds `bg-black`, `bg-slate-950`; text `text-white`, `text-slate-300`, `text-slate-400`.

## Component patterns

- **Buttons:** `bg-linear-to-r` gradients, `hover:shadow-lg`, `transition-all duration-300`; often
  `from-cta-from to-cta-to`
- **Cards:** `bg-slate-800/50`, borders `border-slate-700`, `backdrop-blur-xl`
- **Inputs:** `bg-slate-800/50`, focus `focus:border-app-ring`, `focus:ring-app-ring/30`
- **Badges / progress:** subject gradients (`subject-*` tokens), `rounded-xl`, `rounded-full`

## Typical class structure

- Containers: `max-w-7xl mx-auto px-6 md:px-8`
- Spacing: `py-8`, `gap-4`, `gap-6`
- Gradient text: `bg-clip-text text-transparent bg-linear-to-r from-cta-text-start via-cta-text-via to-cta-text-end`

---

_AI-generated file. Last updated: Monday, May 18, 2026._
