# Estructura del proyecto

Este documento describe la organización de archivos y la arquitectura por características (_feature-based_) del
proyecto.

## Vista general

```txt
src/
├── app/                   # Next.js App Router (rutas, layouts)
│   ├── (auth)/           # Autenticación (login, registro, onboarding)
│   ├── (dashboard)/      # Dashboard (examen, lecciones, logros, progreso, etc.)
│   └── api/              # API Routes (p. ej. chat)
├── features/             # Módulos principales de negocio
├── shared/               # UI transversal (Icon, Footer, ConstructionAlert…)
├── storage/              # Implementación localStorage (uso interno)
├── services/             # Persistencia Supabase/local + store + gamificación
│   ├── persistence/      # API pública para features
│   ├── supabase/
│   ├── store/
│   └── gamification/
├── config/               # Configuración (Supabase, constantes)
├── components/           # Shell global (Providers, guards, DashboardHeader)
├── context/              # AuthContext
├── hooks/                # Facade de hooks + utilidades GSAP
├── lib/                  # GSAP (ScrollTrigger)
├── store/                # Redux: uiSession (demo, plan UI)
├── styles/               # (legacy) preferir src/app/globals.css
├── types/                # Tipos TypeScript globales
└── utils/                # Utilidades puras (cn, errores auth)
```

## Arquitectura por características (`src/features/`)

Cada carpeta dentro de `features/` representa un dominio de negocio.

### Estructura típica de una feature

```txt
features/nombre-feature/
├── components/
├── pages/
├── hooks/
├── services/          # opcional; lógica de dominio local
├── data/ | types/ | utils/
└── index.ts
```

### Features actuales

| Feature       | Responsabilidad                                                              |
| ------------- | ---------------------------------------------------------------------------- |
| **auth/**     | Login, registro, OAuth, onboarding                                           |
| **home/**     | Landing, secciones marketing, donaciones                                     |
| **learning/** | Roadmap, lecciones (`roadmap/`, `lesson-flow/`, `lessons-legacy/`, `shell/`) |
| **exam/**     | Práctica, examen completo, clasificatoria; datos en `exam/data/`             |
| **user/**     | Perfil, configuración, hook `useProgress`                                    |
| **logros/**   | Badges, desafíos, gamificación (UI)                                          |
| **store/**    | Tienda virtual, modales de compra                                            |

## Capa compartida (`src/shared/`)

Componentes y tipos usados en varias features:

- **Icon**, **Footer**, **MascotaCircle**, **ConstructionAlert**
- Reexportaciones `@deprecated` hacia `features/exam` y `@/services/persistence`

La navegación del dashboard vive en **`src/components/DashboardHeader/`** (no en `shared/`).

## Persistencia

- **API para UI:** `@/services/persistence` (progreso, perfil, exámenes, gamificación).
- **Implementación local:** `src/storage/` (`progressStorage`, `userProfile`, `dataEncryption`).
- **Supabase:** `src/services/supabase/*`.

## Servicios transversales (`src/services/`)

Ver [documentación de servicios](../backend/services-api.md).

## Rutas Next.js (`src/app/`)

| Ruta                                  | Descripción                 |
| ------------------------------------- | --------------------------- |
| `/`                                   | Página de inicio            |
| `/login`, `/signup`, `/auth/callback` | Autenticación               |
| `/onboarding`                         | Onboarding                  |
| `/ruta-aprendizaje`                   | Roadmap de aprendizaje      |
| `/lessons/[area]/[topic]`             | Lección (Supabase o legacy) |
| `/practica/[area]`                    | Práctica por área           |
| `/examen-completo`                    | Examen completo             |
| `/clasificatoria`                     | Clasificatoria / ranking    |
| `/desafios-diarios`                   | Desafíos diarios            |
| `/logros`                             | Centro de logros            |
| `/perfil`, `/configuracion`           | Perfil y ajustes            |
| `/terminos`, `/privacidad`            | Legal                       |

---

_Archivo generado por IA. Última actualización: lunes, 18 de mayo de 2026._
