# Estructura de Carpetas - Next.js + Feature-Based

> **Última actualización:** 20 de Marzo del 2026

## Stack Tecnológico

- **Next.js 15** (App Router)
- **React 19**
- **TypeScript**
- **Tailwind CSS 4**
- **Supabase** (auth + PostgreSQL)
- **GSAP** (animaciones)
- **React Markdown**

## Estructura de Archivos

```txt
src/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Rutas de autenticación
│   │   ├── login/
│   │   ├── signup/
│   │   ├── onboarding/
│   │   └── forgot-password/
│   ├── (dashboard)/              # Rutas del dashboard
│   │   ├── practica/[area]/
│   │   ├── examen-completo/
│   │   ├── ruta-aprendizaje/
│   │   ├── lessons/[area]/[topic]/
│   │   ├── logros/
│   │   ├── clasificatoria/
│   │   ├── desafios-diarios/
│   │   ├── perfil/
│   │   └── configuracion/
│   ├── api/                      # API Routes (chat, etc.)
│   ├── privacidad/
│   └── terminos/
│
├── features/                     # Features por dominio
│   ├── exam/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   └── services/
│   ├── learning/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── lessons/              # Lecciones por área
│   │   └── services/
│   ├── home/
│   ├── progress/
│   ├── auth/
│   ├── user/
│   ├── logros/
│   └── store/
│
├── shared/                       # Código compartido
│   ├── components/
│   │   ├── atoms/
│   │   ├── molecules/
│   │   └── organisms/
│   ├── constants/                # areaInfo, etc.
│   ├── data/                     # questions.ts, learningMaterials.ts
│   └── utils/
│
├── services/                     # Capa de datos
│   ├── supabase/
│   ├── api.config.ts
│   └── GamificationServiceAdapter.ts
│
├── config/                       # Supabase, emailMessages
├── components/                   # Providers, layout global
├── hooks/                        # useIsMobile, useScrollAnimation, useGSAP*
├── lib/                          # gsap.ts (config central)
└── styles/                       # global.css (adicional)

```txt
Estilos principales: `app/globals.css` (Tailwind + tema)
```

## Guía de Navegación

| Qué buscas             | Dónde está                                  |
| ---------------------- | ------------------------------------------- |
| Páginas de examen      | `features/exam/pages/`                      |
| Modal de configuración | `features/exam/components/ExamConfigModal/` |
| Página de inicio       | `features/home/pages/HomePage.tsx`          |
| Ruta de aprendizaje    | `app/(dashboard)/ruta-aprendizaje/`         |
| Lecciones por área     | `features/learning/lessons/`                |
| Componentes atómicos   | `shared/components/atoms/`                  |
| Datos de preguntas     | `shared/data/questions.ts`                  |
| Información de áreas   | `shared/constants/areaInfo.ts`              |
| Animaciones GSAP       | `lib/gsap.ts`, `hooks/useGSAP*.ts`          |

## Cómo importar

### Desde features

```typescript
import { PracticePage, FullExamPage } from '@/features/exam/pages';
import { ExamConfigModal } from '@/features/exam/components';
```

### Desde shared

```typescript
import { formatTimeExtended } from '@/shared/utils';
import { Badge, Button, Card } from '@/shared/components/atoms';
import { AREA_INFO } from '@/shared/constants';
```

### Animaciones GSAP

```typescript
import { AnimatedReveal } from '@/shared/components/AnimatedReveal';
import { useGSAPModalEntrance } from '@/hooks/useGSAPModalEntrance';
```

## Rutas Next.js

Las páginas viven en `src/app/` con el App Router. Los componentes de features se importan en las páginas correspondientes.
