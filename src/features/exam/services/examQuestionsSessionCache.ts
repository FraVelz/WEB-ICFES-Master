import type { ExamQuestionPublic } from '@/features/exam/types/question';

const CACHE_PREFIX = 'icfes_exam_questions_v1';
const CACHE_TTL_MS = 20 * 60 * 1000;

type CachedQuestions = {
  fetchedAt: number;
  questions: ExamQuestionPublic[];
};

function cacheKey(area: string, limit: number): string {
  return `${CACHE_PREFIX}:${area}:${limit}`;
}

export function readExamQuestionsSessionCache(area: string, limit: number): ExamQuestionPublic[] | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = sessionStorage.getItem(cacheKey(area, limit));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as CachedQuestions;
    if (!parsed?.fetchedAt || !Array.isArray(parsed.questions)) return null;
    if (Date.now() - parsed.fetchedAt > CACHE_TTL_MS) return null;
    return parsed.questions;
  } catch {
    return null;
  }
}

export function writeExamQuestionsSessionCache(area: string, limit: number, questions: ExamQuestionPublic[]): void {
  if (typeof window === 'undefined') return;
  try {
    const payload: CachedQuestions = { fetchedAt: Date.now(), questions };
    sessionStorage.setItem(cacheKey(area, limit), JSON.stringify(payload));
  } catch {
    // quota exceeded — ignore
  }
}
