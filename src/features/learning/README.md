# Learning Feature Structure

## Organización actual

```
learning/
  pages/
    index.ts                 # Exporta LearningRoadmapPage
    Roadmap/
      LearningRoadmapPage.tsx
  components/
    index.ts
    LearningRoadmap/         # Ruta de aprendizaje (Supabase + UI)
    SecondaryHeader/
    LessonFlow/              # Pasos de lección (flujo interactivo)
    ChatAssistant/
  data/
    roadmapData.ts           # Fallback local (BASICO_TOPICS, etc.) para LearningService
  lessons/                   # Contenido estático por tema (LessonPageClient)
  services/
    LearningService.ts       # Ruta de aprendizaje (Supabase o roadmapData)
  hooks/
    useLearningPath.ts
  constants/
    lessonDynamicRoutes.ts
    practiceDynamicRoutes.ts
  index.ts
```

## Rutas de la app

- `/ruta-aprendizaje` — `LearningRoadmapPage` + asistente
- `/lessons/[area]/[topic]` — flujo con pasos (Supabase) o `LessonPageClient`
- `/practica/[area]` — práctica por área (feature exam)

## Imports típicos

```javascript
import { LearningRoadmapPage } from '@/features/learning/pages';
import { LearningRoadmap, LessonFlowClient } from '@/features/learning/components';
import { LearningService } from '@/features/learning/services/LearningService';
```

## Datos

- `roadmapData.ts`: usado por `LearningService` cuando no hay datos en Supabase.
- Lecciones en `lessons/`: usadas como fallback en `LessonPageClient` si no hay flujo en BD.
