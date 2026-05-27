# Estructura del proyecto

Este documento describe la organización de archivos y la arquitectura por características (_feature-based_) del
proyecto.

## Vista general

```txt
src/
├── app/                   # Next.js App Router (rutas, layouts)
│   ├── (auth)/           # Autenticación (login, registro, onboarding)
│   ├── (dashboard)/      # Dashboard (examen, lecciones, logros, progreso, etc.)
│   ├── auth/callback/    # OAuth callback (fuera del grupo auth)
│   ├── perfil/public/    # Perfil público (sin layout de auth)
│   └── api/              # API Routes (p. ej. chat)
├── features/             # Módulos principales de negocio
├── shared/               # UI transversal (Icon, Footer, ModalOverlay…)
├── storage/              # Implementación localStorage (uso interno)
├── services/             # Persistencia Supabase/local + store + gamificación
│   ├── persistence/      # API pública para features
│   ├── supabase/
│   ├── store/            # Servicios de planes (no confundir con features/store ni Redux)
│   └── gamification/
├── config/               # Configuración (Supabase, constantes)
├── components/           # Shell global (Providers, guards, DashboardHeader)
├── hooks/                # Utilidades GSAP + reexport opcional de hooks
├── lib/                  # GSAP (ScrollTrigger)
├── store/                # Redux: uiSession (demo, plan UI)
├── types/                # Tipos TypeScript globales
└── utils/                # Utilidades puras (cn, errores auth)
```

Estilos globales en **`src/app/globals.css`** (Tailwind 4 + tokens).

## Arquitectura por características (`src/features/`)

Cada carpeta dentro de `features/` representa un dominio de negocio. Ver
[architecture.md](../frontend/architecture.md) para reglas de scope e imports.

### Estructura típica de una feature

```txt
features/nombre-feature/
├── components/
├── pages/
├── hooks/
├── context/           # opcional (p. ej. auth)
├── services/          # opcional; lógica de dominio local
├── data/ | types/ | utils/
└── index.ts
```

### Features actuales

| Feature       | Responsabilidad                                                              |
| ------------- | ---------------------------------------------------------------------------- |
| **auth/**     | Login, registro, OAuth, onboarding, `AuthContext`                            |
| **home/**     | Landing, secciones marketing, donaciones                                     |
| **learning/** | Roadmap, lecciones (`roadmap/`, `lesson-flow/`, `lessons-legacy/`, `shell/`) |
| **exam/**     | Práctica, examen completo, clasificatoria; datos en `exam/data/`             |
| **user/**     | Perfil, configuración, hooks `useProgress`, `useUserData`                    |
| **logros/**   | Badges, desafíos, gamificación (UI)                                          |
| **store/**    | Tienda virtual (UI), modales de compra                                       |

### Tres nombres “store”

| Ruta              | Qué es                                                              |
| ----------------- | ------------------------------------------------------------------- |
| `features/store/` | Componentes y hooks de la tienda                                    |
| `services/store/` | Lógica de planes (`SubscriptionPlanService`, `PlanScheduleService`) |
| `store/` (Redux)  | Estado UI: modo demo, plan seleccionado                             |

## Capa compartida (`src/shared/`)

Componentes usados en varias features:

- **Icon**, **Footer**, **MascotaCircle**, **ConstructionAlert**, **ModalOverlay**
- Constantes de áreas ICFES en `shared/constants/areaInfo.ts`

La navegación del dashboard vive en **`src/components/DashboardHeader/`** (no en `shared/`).

## Persistencia

- **API para UI:** `@/services/persistence` (progreso, perfil, exámenes, gamificación).
- **Implementación local:** `src/storage/` (`progressStorage`, `userProfile`, `dataEncryption`).
- **Supabase:** `src/services/supabase/*`.

Ver también [progreso-cliente-local.md](../data/progreso-cliente-local.md) para datos que no se sincronizan solos.

## Módulo de aprendizaje (tres pipelines)

| Pipeline    | Fuente de datos     | Pantalla                  |
| ----------- | ------------------- | ------------------------- |
| Roadmap     | `learning_content`  | `/ruta-aprendizaje`       |
| Lesson flow | `lessons` + `steps` | `/lessons/[area]/[topic]` |
| Legacy      | `lessons-legacy/`   | Fallback en la misma ruta |

Guías: [learning-structure-guide.md](../data/learning-structure-guide.md),
[lessons-steps-guide.md](../data/lessons-steps-guide.md).

## Servicios transversales (`src/services/`)

Ver [documentación de servicios](../backend/services-api.md).

## Rutas Next.js (`src/app/`)

Las URLs llevan **`/` final** (`trailingSlash: true`). Lista completa en [routes.md](../setup/routes.md).

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
| `/perfil`, `/perfil/public`           | Perfil privado y público    |
| `/configuracion`                      | Ajustes                     |
| `/terminos`, `/privacidad`            | Legal                       |

---

_Archivo generado por IA. Última actualización: miércoles, 27 de mayo de 2026._
