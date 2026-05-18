# Learning feature structure

## Current layout

```txt
learning/
  pages/
    LearningRoadmapPage.tsx
  roadmap/                 # Learning path UI (modals, PathNode, AreaPath)
  lesson-flow/             # Supabase step-based lessons (LessonFlowClient)
  shell/
    SecondaryHeader/       # Streak, coins, areas, store entry
    ChatAssistant/
  lessons-legacy/          # Static topic components + registry.ts
  data/
    roadmapData.ts
  services/
    LearningService.ts
  hooks/
    useLearningPath.ts
    RoadmapUiContext.tsx   # UI lock while modals open (was context-isActiveStore)
  constants/
    lessonDynamicRoutes.ts
    practiceDynamicRoutes.ts
  utils/
    splitLessonContent.ts
  AnimatedOnMount.tsx
  components/index.ts      # Barrel: roadmap, shell, lesson-flow exports
```

## App routes

- `/ruta-aprendizaje` — `LearningRoadmapPage` + chat assistant
- `/lessons/[area]/[topic]` — `LessonFlowClient` (Supabase) or `lessons-legacy/registry` fallback
- `/practica/[area]` — practice (exam feature)

## Typical imports

```typescript
import { LearningRoadmapPage } from '@/features/learning/pages/LearningRoadmapPage';
import { LearningRoadmap, LessonFlowClient } from '@/features/learning/components';
import { RoadmapUiProvider } from '@/features/learning/hooks/RoadmapUiContext';
import { getLegacyLessonComponent } from '@/features/learning/lessons-legacy/registry';
```

## Data

- `roadmapData.ts`: fallback when Supabase has no roadmap rows.
- `lessons-legacy/`: static React lessons; registry maps `area/topic` slugs to components.
