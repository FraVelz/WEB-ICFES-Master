# Estructura del proyecto

Este documento describe la organización de archivos y la arquitectura por características (_feature-based_) del
proyecto.

## Vista general

```txt
src/
├── app/                   # Next.js App Router (rutas, layouts, favicon.ico)
│   ├── (auth)/           # Autenticación (login, registro, onboarding)
│   ├── (dashboard)/      # Dashboard (examen, lecciones, logros, progreso, etc.)
│   ├── auth/callback/    # OAuth callback (fuera del grupo auth)
│   ├── perfil/public/    # Perfil público (sin layout de auth)
│   └── api/              # API Routes (p. ej. chat)
├── assets/               # Imágenes globales (mascota, marca) — importar desde @/assets
├── features/             # Módulos principales de negocio
├── shared/               # UI transversal (Icon, ModalOverlay…) + constantes ICFES
├── storage/              # Implementación localStorage (uso interno)
├── services/             # Persistencia Supabase/local + store + gamificación
│   ├── persistence/      # API pública para features
│   ├── persistence/      # Capa unificada (Supabase + demo local)
│   ├── supabase/
│   ├── store/            # Servicios de planes (no confundir con features/store ni Zustand)
│   └── gamification/
├── config/               # Supabase (`supabase.ts`, `supabaseClient.ts`) y `emailMessages.ts`
├── components/           # Shell global (Providers, guards, DashboardHeader)
├── hooks/                # GSAP + hooks transversales (`hooks/gamification/`)
├── lib/                  # GSAP (ScrollTrigger)
├── store/                # Zustand: uiSession (demo, plan UI) + `demoMode.ts`
├── types/                # Tipos TypeScript globales
└── utils/                # Utilidades puras (`cn`)
```

Estilos globales en **`src/app/globals.css`** (Tailwind 4 + tokens).

## Assets estáticos (`src/assets/`)

Imágenes compartidas importadas en código (no rutas `/public/...`):

| Ruta              | Uso                                                         |
| ----------------- | ----------------------------------------------------------- |
| `assets/avatars/` | Mascota Zeus (estados: logo, pensativo, celebrando, etc.)   |
| `assets/images/`  | Capturas de marca (README, Open Graph)                      |
| `assets/index.ts` | API pública: `MASCOT_IMAGES`, `mascotSrc()`, `BRAND_IMAGES` |

Favicon: **`src/app/favicon.ico`** (convención App Router). Metadata OG en `src/app/layout.tsx` usa `BRAND_IMAGES.screenshot`.

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

| Feature           | Responsabilidad                                                                      |
| ----------------- | ------------------------------------------------------------------------------------ |
| **auth/**         | Login, registro, OAuth, onboarding, `AuthContext`                                    |
| **home/**         | Landing, secciones marketing, donaciones                                             |
| **learning/**     | Roadmap y chat IA (`roadmap/`, `shell/`, `context/`)                                 |
| **exam/**         | Práctica, examen completo, ligas; datos en `exam/data/`                     |
| **user/**         | Perfil, configuración, hooks `useProgress`, `useUserData`                            |
| **achievements/** | Badges, UI de logros (ruta `/logros/`; hooks transversales en `hooks/gamification/`) |
| **store/**        | Tienda virtual (UI), modales de compra                                               |

### Tres nombres “store”

| Ruta               | Qué es                                                              |
| ------------------ | ------------------------------------------------------------------- |
| `features/store/`  | Componentes y hooks de la tienda                                    |
| `services/store/`  | Lógica de planes (`SubscriptionPlanService`, `PlanScheduleService`) |
| `store/` (Zustand) | Estado UI: modo demo, plan seleccionado                             |

## Capa compartida (`src/shared/`)

Componentes usados en varias features:

- **Icon**, **MascotaCircle**, **ModalOverlay**
- Constantes ICFES en `shared/constants/` (`areaInfo`, `ranks`, `practiceAreas`, `achievementsData`)

Componentes de una sola feature viven en esa feature (p. ej. `Footer` de la landing en `features/home/components/`).

La navegación del dashboard vive en **`src/components/DashboardHeader/`** (no en `shared/`).

## Persistencia

- **API para UI:** `@/services/persistence` (progreso, perfil, exámenes, gamificación).
- **Local implementation:** `src/storage/progressStorage.ts` (client progress cache).
- **Supabase:** `src/services/supabase/*`.

Ver también [progreso-cliente-local.md](../data/progreso-cliente-local.md) para datos que no se sincronizan solos.

## Módulo de aprendizaje

| Pipeline | Fuente de datos    | Pantalla            |
| -------- | ------------------ | ------------------- |
| Roadmap  | `learning_content` | `/ruta-aprendizaje` |

Guía: [learning-structure-guide.md](../data/learning-structure-guide.md).

## Servicios transversales (`src/services/`)

Ver [documentación de servicios](../backend/services-api.md).

## Rutas Next.js (`src/app/`)

Las URLs llevan **`/` final** (`trailingSlash: true`). Lista completa en [routes.md](../setup/routes.md).

| Ruta                                  | Descripción                                 |
| ------------------------------------- | ------------------------------------------- |
| `/`                                   | Página de inicio                            |
| `/login`, `/signup`, `/auth/callback` | Autenticación                               |
| `/onboarding`                         | Onboarding                                  |
| `/ruta-aprendizaje`                   | Roadmap de aprendizaje                      |
| `/practica/[area]`                    | Práctica por área                           |
| `/examen-completo`                    | Examen completo                             |
| `/ligas`                     | Ligas / ranking semanal                     |
| `/logros/`                            | Centro de logros (`features/achievements/`) |
| `/perfil`, `/perfil/public`           | Perfil privado y público                    |
| `/configuracion`                      | Ajustes                                     |
| `/terminos`, `/privacidad`            | Legal                                       |

---

_Archivo generado por IA. Última actualización: miércoles, 27 de mayo de 2026._
