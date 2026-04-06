# Folder Structure - Next.js + Feature-Based

> **Last updated:** March 19, 2025

## Tech Stack

- **Next.js 15** (App Router)
- **React 19**
- **TypeScript**
- **Tailwind CSS 4**
- **Supabase** (auth + PostgreSQL)
- **GSAP** (animations)
- **React Markdown**

## File Structure

```txt
src/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Authentication routes
│   │   ├── login/
│   │   ├── signup/
│   │   ├── onboarding/
│   │   └── forgot-password/
│   ├── (dashboard)/              # Dashboard routes
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
├── features/                     # Features by domain
│   ├── exam/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   └── services/
│   ├── learning/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── lessons/              # Lessons by area
│   │   └── services/
│   ├── home/
│   ├── progress/
│   ├── auth/
│   ├── user/
│   ├── logros/
│   └── store/
│
├── shared/                       # Shared code
│   ├── components/
│   │   ├── atoms/
│   │   ├── molecules/
│   │   └── organisms/
│   ├── constants/                # areaInfo, etc.
│   ├── data/                     # questions.ts, learningMaterials.ts
│   └── utils/
│
├── services/                     # Data layer
│   ├── supabase/
│   ├── api.config.ts
│   └── GamificationServiceAdapter.ts
│
├── config/                       # Supabase, emailMessages
├── components/                   # Providers, global layout
├── hooks/                        # useIsMobile, useScrollAnimation, useGSAP*
├── lib/                          # gsap.ts (central config)
└── styles/                       # global.css (additional)
```

Main styles: `app/globals.css` (Tailwind + theme)

## Navigation Guide

| What you need     | Location                                    |
| ----------------- | ------------------------------------------- |
| Exam pages        | `features/exam/pages/`                      |
| Config modal      | `features/exam/components/ExamConfigModal/` |
| Home page         | `features/home/pages/HomePage.tsx`          |
| Learning path     | `app/(dashboard)/ruta-aprendizaje/`         |
| Lessons by area   | `features/learning/lessons/`                |
| Atomic components | `shared/components/atoms/`                  |
| Question data     | `shared/data/questions.ts`                  |
| Area info         | `shared/constants/areaInfo.ts`              |
| GSAP animations   | `lib/gsap.ts`, `hooks/useGSAP*.ts`          |

## How to Import

### From features

```typescript
import { PracticePage, FullExamPage } from '@/features/exam/pages';
import { ExamConfigModal } from '@/features/exam/components';
```

### From shared

```typescript
import { formatTimeExtended } from '@/shared/utils';
import { Badge, Button, Card } from '@/shared/components/atoms';
import { AREA_INFO } from '@/shared/constants';
```

### GSAP Animations

```typescript
import { AnimatedReveal } from '@/shared/components/AnimatedReveal';
import { useGSAPModalEntrance } from '@/hooks/useGSAPModalEntrance';
```

## Next.js Routes

Pages live in `src/app/` with the App Router. Feature components are imported in the corresponding pages.
