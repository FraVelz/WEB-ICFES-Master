# Project Structure

This document describes the file organization and "Feature-Based" architecture of the project.

## Overview

```txt
src/
├── app/                   # Next.js App Router (routes, layouts)
│   ├── (auth)/           # Authentication routes (login, signup, onboarding)
│   ├── (dashboard)/      # Dashboard routes (exam, lessons, achievements)
│   └── api/              # API Routes (e.g. chat)
├── features/             # Main business modules
├── shared/               # Reusable components and utilities
├── services/             # Data layer (Supabase, adapters)
├── config/               # Configuration (Supabase, constants)
├── components/           # Global components (Providers, etc.)
├── hooks/                # Global hooks
├── styles/               # Global styles (Tailwind)
└── ...
```

## Feature-Based Architecture (`src/features/`)

Each folder inside `features/` represents a business domain and contains everything needed to function in isolation.

### Feature Structure

```txt
features/feature-name/
├── components/         # Components exclusive to this feature
├── pages/              # Views (if used outside app/)
├── hooks/              # Local state logic
├── services/           # Feature-specific services
├── utils/              # Helper functions
└── index.ts            # Barrel export
```

### Current Features

- **exam/**: Exam logic, simulations, and results.
- **learning/**: Study material, lessons, and roadmap.
- **progress/**: User statistics and tracking.
- **home/**: Home page and dashboard.
- **auth/**: Login, registration, onboarding.
- **user/**: Profile, settings.
- **logros/**: Gamification, achievements, challenges.
- **store/**: Shop, plans, subscriptions.

## Shared Components (`src/shared/`)

- **atoms/**: Indivisible elements (Buttons, Badges, Text).
- **molecules/**: Simple combinations (Cards, Inputs with label).
- **organisms/**: Complex structures (Headers, PaymentModal, QuestionContent).

## Services (`src/services/`)

Abstraction layer for Supabase communication and business logic.
See [Services Documentation](../backend/services-api.md).

## Next.js Routes (`src/app/`)

| Route                      | Description          |
| -------------------------- | -------------------- |
| `/`                        | Home page            |
| `/login`, `/signup`        | Authentication       |
| `/onboarding`              | Onboarding flow      |
| `/practica/[area]`         | Practice by area     |
| `/examen-completo`         | Full exam            |
| `/ruta-aprendizaje`        | Learning roadmap     |
| `/lessons/[area]/[topic]`  | Lessons by topic     |
| `/logros`                  | Achievements center  |
| `/perfil`                  | User profile         |
| `/configuracion`           | Settings             |
