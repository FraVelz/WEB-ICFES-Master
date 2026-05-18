'use client';

import type { ReactNode } from 'react';

import type {
  ContentStepData,
  LessonStepRow,
  MathInputStepData,
  QuizStepData,
  ResourceStepData,
  StepType,
} from '@/features/learning/types/lessonFlow';

import { ContentStep, MathInputStep, QuizStep, ResourceStep } from './steps';

function isKnownStepType(type: string): type is StepType {
  return type === 'content' || type === 'quiz' || type === 'math_input' || type === 'resource';
}

type MarkReady = (value?: boolean) => void;

/**
 * Punto de extensión: añade nuevos `case` o componentes sin tocar el control de flujo.
 */
export function renderLessonStep(step: LessonStepRow, markReady: MarkReady): ReactNode {
  if (!isKnownStepType(step.type)) {
    return <p className="text-center text-rose-400">Tipo de paso no soportado: {step.type}</p>;
  }

  switch (step.type) {
    case 'content':
      return <ContentStep data={step.data as ContentStepData} onStepReady={() => markReady(true)} />;
    case 'quiz':
      return <QuizStep data={step.data as QuizStepData} onStepReady={(ready) => markReady(ready)} />;
    case 'math_input':
      return <MathInputStep data={step.data as MathInputStepData} onStepReady={(ready) => markReady(ready)} />;
    case 'resource':
      return <ResourceStep data={step.data as ResourceStepData} onStepReady={() => markReady(true)} />;
    default:
      return null;
  }
}
