# Project structure

This document describes the file organization and feature-based architecture of the project.

## Overview

```txt
src/
├── app/                   # Next.js App Router (routes, layouts, favicon.ico)
│   ├── (auth)/           # Authentication (login, signup, onboarding)
│   ├── (dashboard)/      # Dashboard (exam, lessons, achievements, progress, etc.)
│   ├── auth/callback/    # OAuth callback (outside auth group)
│   ├── perfil/public/    # Public profile (no auth layout)
│   └── api/              # API routes (e.g. chat)
├── assets/               # Global images (mascot, brand) — import from @/assets
├── features/             # Main business modules
├── shared/               # Cross-feature UI (Icon, ModalOverlay…) + ICFES constants
├── storage/              # localStorage implementation (internal)
├── services/             # Supabase/local persistence + store + gamification
│   ├── persistence/      # Public API for features
│   ├── persistence/      # Unified layer (Supabase + local demo)
│   ├── supabase/
│   ├── store/            # Plan services (not features/store or Zustand)
│   └── gamification/
├── config/               # Supabase (`supabase.ts`, `supabaseClient.ts`) and `emailMessages.ts`
├── components/           # App shell (Providers, guards, DashboardHeader)
├── hooks/                # GSAP + cross-feature hooks (`hooks/gamification/`)
├── lib/                  # GSAP (ScrollTrigger)
├── store/                # Zustand: uiSession (demo, plan UI) + `demoMode.ts`
├── types/                # Global TypeScript types
└── utils/                # Pure utilities (`cn`)
```

Global styles live in **`src/app/globals.css`** (Tailwind 4 + tokens).

## Static assets (`src/assets/`)

Shared images imported in code (not `/public/...` URL paths):

| Path              | Purpose                                                    |
| ----------------- | ---------------------------------------------------------- |
| `assets/avatars/` | Zeus mascot (logo, pensativo, celebrando, etc.)            |
| `assets/images/`  | Brand screenshots (README, Open Graph)                     |
| `assets/index.ts` | Public API: `MASCOT_IMAGES`, `mascotSrc()`, `BRAND_IMAGES` |

Favicon: **`src/app/favicon.ico`** (App Router convention). OG metadata in `src/app/layout.tsx` uses `BRAND_IMAGES.screenshot`.

## Feature-based architecture (`src/features/`)

Each folder under `features/` represents a business domain. See
[architecture.md](../frontend/architecture.md) for scope rules and imports.

### Typical feature layout

```txt
features/feature-name/
├── components/
├── pages/
├── hooks/
├── context/           # optional (e.g. auth)
├── services/          # optional; local domain logic
├── data/ | types/ | utils/
└── index.ts
```

### Current features

| Feature           | Responsibility                                                                           |
| ----------------- | ---------------------------------------------------------------------------------------- |
| **auth/**         | Login, signup, OAuth, onboarding, `AuthContext`                                          |
| **home/**         | Landing, marketing sections, donations                                                   |
| **learning/**     | Roadmap and AI chat (`roadmap/`, `shell/`, `context/`)                                   |
| **exam/**         | Practice, full exam, ranking; data in `exam/data/`                                       |
| **user/**         | Profile, settings, hooks `useProgress`, `useUserData`                                    |
| **achievements/** | Badges, achievements UI (route `/logros/`; cross-feature hooks in `hooks/gamification/`) |
| **store/**        | Virtual shop (UI), purchase modals                                                       |

### Three different “store” names

| Path               | What it is                                                    |
| ------------------ | ------------------------------------------------------------- |
| `features/store/`  | Shop components and hooks                                     |
| `services/store/`  | Plan logic (`SubscriptionPlanService`, `PlanScheduleService`) |
| `store/` (Zustand) | UI state: demo mode, selected plan                            |

## Shared layer (`src/shared/`)

Components used across features:

- **Icon**, **MascotaCircle**, **ModalOverlay**
- ICFES constants in `shared/constants/` (`areaInfo`, `ranks`, `practiceAreas`, `achievementsData`)

Single-feature components live in that feature (e.g. landing `Footer` in `features/home/components/`).

Dashboard navigation lives in **`src/components/DashboardHeader/`** (not in `shared/`).

## Persistence

- **UI API:** `@/services/persistence` (progress, profile, exams, gamification).
- **Local implementation:** `src/storage/progressStorage.ts` (client progress cache).
- **Supabase:** `src/services/supabase/*`.

See also [client-local-progress.md](../data/client-local-progress.md) for data not auto-synced to the backend.

## Learning module

| Pipeline | Data source        | Screen              |
| -------- | ------------------ | ------------------- |
| Roadmap  | `learning_content` | `/ruta-aprendizaje` |

Guide: [learning-structure-guide.md](../data/learning-structure-guide.md).

## Cross-cutting services (`src/services/`)

See [services documentation](../backend/services-api.md).

## Next.js routes (`src/app/`)

URLs end with a **trailing slash** (`trailingSlash: true`). Full list in [routes.md](../setup/routes.md).

| Route                                 | Description                                 |
| ------------------------------------- | ------------------------------------------- |
| `/`                                   | Home                                        |
| `/login`, `/signup`, `/auth/callback` | Authentication                              |
| `/onboarding`                         | Onboarding                                  |
| `/ruta-aprendizaje`                   | Learning roadmap                            |
| `/practica/[area]`                    | Practice by area                            |
| `/examen-completo`                    | Full exam                                   |
| `/ligas`                              | Weekly leagues / ranking                    |
| `/logros/`                            | Achievements hub (`features/achievements/`) |
| `/perfil`, `/perfil/public`           | Private and public profile                  |
| `/configuracion`                      | Settings                                    |
| `/terminos`, `/privacidad`            | Legal                                       |

---

_AI-generated file. Last updated: Wednesday, May 27, 2026._
