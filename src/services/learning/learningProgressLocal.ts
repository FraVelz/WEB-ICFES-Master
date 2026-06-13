import { STORAGE_KEYS } from '@/storage/progressStorageTypes';
import { getBlockExamPasses, type BlockExamPassRecord } from '@/services/persistence/blockExamPersistence';
import { getPhaseSkips, type PhaseSkipRecord } from '@/services/persistence/phaseSkipPersistence';
import {
  EMPTY_LEARNING_PROGRESS,
  LEARNING_PROGRESS_META_KEY,
  LEARNING_PROGRESS_UPDATED_EVENT,
  type LearningProgressSnapshot,
} from './learningProgressTypes';

export function readLearningProgressRemoteMeta(rawAchievements: unknown): LearningProgressSnapshot {
  if (typeof rawAchievements !== 'object' || rawAchievements === null || Array.isArray(rawAchievements)) {
    return EMPTY_LEARNING_PROGRESS;
  }

  const meta = (rawAchievements as Record<string, unknown>)[LEARNING_PROGRESS_META_KEY];
  if (typeof meta !== 'object' || meta === null || Array.isArray(meta)) {
    return EMPTY_LEARNING_PROGRESS;
  }

  const payload = meta as Record<string, unknown>;
  const completedLessons = Array.isArray(payload.completedLessons)
    ? payload.completedLessons.filter((id): id is string => typeof id === 'string')
    : [];
  const phaseSkips = Array.isArray(payload.phaseSkips)
    ? payload.phaseSkips.filter((entry): entry is PhaseSkipRecord => {
        if (typeof entry !== 'object' || entry === null) return false;
        const row = entry as PhaseSkipRecord;
        return (
          typeof row.areaId === 'string' &&
          typeof row.sectionId === 'string' &&
          typeof row.passedAt === 'string' &&
          typeof row.score === 'number'
        );
      })
    : [];
  const blockExamPasses = Array.isArray(payload.blockExamPasses)
    ? payload.blockExamPasses.filter((entry): entry is BlockExamPassRecord => {
        if (typeof entry !== 'object' || entry === null) return false;
        const row = entry as BlockExamPassRecord;
        return (
          typeof row.areaId === 'string' &&
          typeof row.blockId === 'string' &&
          typeof row.passedAt === 'string' &&
          typeof row.score === 'number'
        );
      })
    : [];

  return { completedLessons, phaseSkips, blockExamPasses };
}

export function getLocalLearningProgress(): LearningProgressSnapshot {
  if (typeof window === 'undefined') return EMPTY_LEARNING_PROGRESS;

  try {
    const stored = localStorage.getItem(STORAGE_KEYS.COMPLETED_LESSONS);
    const completedLessons = stored ? (JSON.parse(stored) as string[]) : [];
    return {
      completedLessons: Array.isArray(completedLessons) ? completedLessons.filter(Boolean) : [],
      phaseSkips: getPhaseSkips(),
      blockExamPasses: getBlockExamPasses(),
    };
  } catch {
    return EMPTY_LEARNING_PROGRESS;
  }
}

export function applyLearningProgressToLocal(snapshot: LearningProgressSnapshot): void {
  if (typeof window === 'undefined') return;

  localStorage.setItem(STORAGE_KEYS.COMPLETED_LESSONS, JSON.stringify(snapshot.completedLessons));
  localStorage.setItem('icfes_phase_skips', JSON.stringify(snapshot.phaseSkips));
  localStorage.setItem('icfes_block_exam_passes', JSON.stringify(snapshot.blockExamPasses));
  window.dispatchEvent(new Event(LEARNING_PROGRESS_UPDATED_EVENT));
}
