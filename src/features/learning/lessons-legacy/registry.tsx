import type { ComponentType } from 'react';

import { groupLessonRoutePairsByArea } from '@/shared/constants/lessonRoutes';

import { LegacyLessonLayout } from './LegacyLessonLayout';
import { LEGACY_LESSON_CONTENT } from './lessonContents';
import { LEGACY_AREA_THEMES } from './types';

function createLegacyLesson(area: string, topic: string): ComponentType {
  const entry = LEGACY_LESSON_CONTENT[area]?.[topic];
  const theme = LEGACY_AREA_THEMES[area];

  if (!entry || !theme) {
    return function MissingLegacyLesson() {
      return null;
    };
  }

  return function LegacyLesson() {
    return <LegacyLessonLayout entry={entry} theme={theme} />;
  };
}

/** Static legacy lesson components keyed by `/lessons/[area]/[topic]` */
export const LEGACY_LESSON_REGISTRY: Record<string, Record<string, ComponentType>> = Object.fromEntries(
  Object.entries(groupLessonRoutePairsByArea()).map(([area, topics]) => [
    area,
    Object.fromEntries(topics.map((topic) => [topic, createLegacyLesson(area, topic)])),
  ])
);

export function getLegacyLessonComponent(area: string, topic: string): ComponentType | undefined {
  return LEGACY_LESSON_REGISTRY[area]?.[topic];
}
