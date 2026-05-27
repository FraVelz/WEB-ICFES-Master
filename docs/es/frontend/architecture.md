# Arquitectura frontend (feature-based)

Este proyecto **no** usa Atomic Design como capa de carpetas. La organización es **por dominio de negocio**
(`src/features/`).

---

## Árbol de decisión

1. **¿Solo una ruta de App Router?** → `src/app/.../_components/` (o co-localizado junto a `page.tsx` si el componente es pequeño).
2. **¿Solo una feature** (`auth`, `exam`, `learning`, `logros`, `store`, `user`, `home`)? →
   `src/features/<feature>/components/` (o `hooks/`, `context/`, `utils/`, `data/` dentro de esa feature).
3. **¿Shell de toda la app** (providers, guards, header del dashboard)? → `src/components/`.
4. **¿UI reutilizada en 2+ features** (Icon, alertas)? → `src/shared/components/`.
5. **¿Hooks de dominio usados en 2+ features** (gamificación)? → `src/hooks/gamification/`.
6. **¿Persistencia o integraciones backend?** → `src/services/` (`@/services/persistence`, etc.).
7. **¿Estado UI global** (modo demo)? → `src/store/` (`demoMode.ts`, Redux `uiSession`).
8. **¿Duda?** → Empezar en el scope más pequeño. Subir a `shared/` solo cuando haya **segundo consumidor** fuera
   de esa feature.

---

## Imports recomendados

```tsx
// ✅ Hook de una feature
import { useProgress } from '@/features/user/hooks/useProgress';

// ✅ Auth
import { useAuth } from '@/features/auth/context/AuthContext';

// ✅ Persistencia
import { getProgress } from '@/services/persistence';

// ✅ Gamificación transversal
import { useGamification } from '@/hooks/gamification';

// ✅ Constantes de práctica / rangos
import { PRACTICA_AREA_SLUGS } from '@/shared/constants/practiceAreas';
import { RANKS } from '@/shared/constants/ranks';

// ✅ UI transversal
import { Icon } from '@/shared/components/Icon';

// ⚠️ Evitar barrels globales salvo utilidades GSAP
import { useGSAPReveal } from '@/hooks/useGSAPReveal';
```

El barrel `@/hooks` reexporta hooks de features por comodidad, pero **preferir imports directos** desde la feature
propietaria.

---

## Tres nombres “store” (no confundir)

| Ruta                  | Rol                                                           |
| --------------------- | ------------------------------------------------------------- |
| `src/features/store/` | UI de tienda (modales, tarjetas de items)                     |
| `src/services/store/` | Servicios de planes y suscripción (`SubscriptionPlanService`) |
| `src/store/`          | Redux: sesión UI (`uiSession`: demo, plan seleccionado)       |

---

## Tres pipelines de lecciones

| Pipeline    | Datos                                        | Pantalla                             |
| ----------- | -------------------------------------------- | ------------------------------------ |
| Roadmap     | Tabla `learning_content` + `LearningService` | `/ruta-aprendizaje`                  |
| Lesson flow | Tablas `lessons` + `steps`                   | `/lessons/[area]/[topic]`            |
| Legacy      | `lessons-legacy/` estático                   | Fallback si no hay steps en Supabase |

Ver [learning-structure-guide.md](../data/learning-structure-guide.md) y
[lessons-steps-guide.md](../data/lessons-steps-guide.md).

---

## Convención de slugs de área

| Contexto                             | Ejemplo slug                                                |
| ------------------------------------ | ----------------------------------------------------------- |
| Práctica / roadmap / constantes      | `lectura-critica`, `matematicas`, `ciencias-naturales`      |
| URL `/lessons/...`                   | `lenguaje`, `matematicas`, `ciencias`, `sociales`, `ingles` |
| Columna `area` en `learning_content` | `lectura_critica`, `matematicas`, `ciencias_naturales`      |

Mapeo en código: `ROADMAP_AREA_TO_LESSON_AREA` en
`src/features/learning/constants/lessonDynamicRoutes.ts`.

---

_Archivo generado por IA. Última actualización: miércoles, 27 de mayo de 2026._
