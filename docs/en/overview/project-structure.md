# Project structure

This document describes the file organization and feature-based architecture of the project.

## Overview

```txt
src/
├── app/                   # Next.js App Router (routes, layouts)
│   ├── (auth)/           # Authentication (login, signup, onboarding)
│   ├── (dashboard)/      # Dashboard (exam, lessons, achievements, progress, etc.)
│   └── api/              # API routes (e.g. chat)
├── features/             # Main business modules
├── shared/               # Cross-feature UI (Icon, Footer, ConstructionAlert…)
├── storage/              # localStorage implementation (internal)
├── services/             # Supabase/local persistence + store + gamification
│   ├── persistence/      # Public API for features
│   ├── supabase/
│   ├── store/
│   └── gamification/
├── config/               # Configuration (Supabase, constants)
├── components/           # App shell (Providers, guards, DashboardHeader)
├── context/              # AuthContext
├── hooks/                # Hook facade + GSAP utilities
├── lib/                  # GSAP (ScrollTrigger)
├── store/                # Redux: uiSession (demo, plan UI)
├── styles/               # Global styles (Tailwind)
├── types/                # Global TypeScript types
└── utils/                # Pure utilities (cn, auth errors)
```

## Feature-based architecture (`src/features/`)

Each folder under `features/` represents a business domain.

### Typical feature layout

```txt
features/feature-name/
├── components/
├── pages/
├── hooks/
├── services/          # optional; local domain logic
├── data/ | types/ | utils/
└── index.ts
```

### Current features

| Feature | Responsibility |
| ------- | -------------- |
| **auth/** | Login, signup, OAuth, onboarding |
| **home/** | Landing, marketing sections, donations |
| **learning/** | Roadmap, lessons (`roadmap/`, `lesson-flow/`, `lessons-legacy/`, `shell/`) |
| **exam/** | Practice, full exam, ranking; data under `exam/data/` |
| **progress/** | Academic progress page and hook |
| **user/** | Profile, settings |
| **logros/** | Badges, challenges, gamification UI |
| **store/** | Virtual shop, purchase modals |

## Shared layer (`src/shared/`)

Components and types used across features:

- **Icon**, **Footer**, **MascotaCircle**, **ConstructionAlert**
- `@deprecated` re-exports toward `features/exam` and `@/services/persistence`

Dashboard navigation lives in **`src/components/DashboardHeader.tsx`** (not under `shared/`).

## Persistence

- **UI API:** `@/services/persistence` (progress, profile, exams, gamification).
- **Local implementation:** `src/storage/` (`progressStorage`, `userProfile`, `dataEncryption`).
- **Supabase:** `src/services/supabase/*`.

## Cross-cutting services (`src/services/`)

See [services documentation](../backend/services-api.md).

## Next.js routes (`src/app/`)

| Route | Description |
| ----- | ----------- |
| `/` | Home page |
| `/login`, `/signup`, `/auth/callback` | Authentication |
| `/onboarding` | Onboarding |
| `/ruta-aprendizaje` | Learning roadmap |
| `/lessons/[area]/[topic]` | Lesson (Supabase or legacy) |
| `/practica/[area]` | Practice by area |
| `/examen-completo` | Full exam |
| `/clasificatoria` | Ranking / leaderboard |
| `/progreso` | Progress summary |
| `/desafios-diarios` | Daily challenges |
| `/logros` | Achievements hub |
| `/perfil`, `/configuracion` | Profile and settings |
| `/terminos`, `/privacidad` | Legal |

---
*AI-generated file. Last updated: Monday, May 18, 2026.*
