# Project structure

This document describes the file organization and feature-based architecture of the project.

## Overview

```txt
src/
├── app/                   # Next.js App Router (routes, layouts)
│   ├── (auth)/           # Authentication (login, signup, onboarding)
│   ├── (dashboard)/      # Dashboard (exam, lessons, achievements, etc.)
│   └── api/              # API routes (e.g. chat)
├── features/             # Main business modules
├── shared/               # Reusable components and utilities
├── services/             # Data layer (Supabase, adapters)
├── config/               # Configuration (Supabase, constants)
├── components/           # Global components (providers, etc.)
├── context/              # React context providers
├── hooks/                # Global hooks
├── lib/                  # Client-side utilities
├── store/                # Redux store and related types
├── styles/               # Global styles (Tailwind)
├── types/                # Global TypeScript types
├── utils/                # Root utilities (e.g. `cn`)
└── ...
```

## Feature-based architecture (`src/features/`)

Each folder under `features/` represents a business domain and groups what it needs to work in isolation.

### Feature layout

```txt
features/feature-name/
├── components/         # Components specific to this feature
├── pages/              # Views (if used outside `app/`)
├── hooks/              # Local state logic
├── services/           # Feature-specific services
├── utils/              # Helper functions
└── index.ts            # Barrel export
```

### Current features

- **exam/**: Exams, simulations, and results.
- **learning/**: Study material, lessons, and roadmap.
- **progress/**: User statistics and tracking.
- **home/**: Landing and dashboard entry points.
- **auth/**: Login, registration, onboarding.
- **user/**: Profile and account settings.
- **logros/**: Gamification, achievements, and challenges.
- **store/**: Shop, plans, and subscriptions.
- **legal/**: Pointers to legal content (e.g. terms and privacy under `src/app`).

## Shared components (`src/shared/`)

- **atoms/**: Small primitives (buttons, badges, text).
- **molecules/**: Simple compositions (cards, inputs with labels).
- **organisms/**: Larger sections (headers, PaymentModal, QuestionContent).

## Services (`src/services/`)

Abstraction layer for Supabase and shared business logic.
See [services documentation](../backend/services-api.md).

## Next.js routes (`src/app/`)

| Route                     | Description              |
| ------------------------- | ------------------------ |
| `/`                       | Home page                |
| `/login`, `/signup`       | Authentication           |
| `/onboarding`             | Onboarding flow          |
| `/practica/[area]`        | Practice by subject area |
| `/examen-completo`        | Full exam                |
| `/clasificatoria`         | Ranking / leaderboard    |
| `/ruta-aprendizaje`       | Learning roadmap         |
| `/lessons/[area]/[topic]` | Lessons by topic         |
| `/desafios-diarios`       | Daily challenges         |
| `/logros`                 | Achievements hub         |
| `/perfil`                 | User profile             |
| `/configuracion`          | Settings                 |
| `/terminos`               | Terms of use             |
| `/privacidad`             | Privacy policy           |

---
*AI-generated file. Last updated: Saturday, May 16, 2026.*
