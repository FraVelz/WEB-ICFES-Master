import { supabase } from '@/config/supabase';
import { isSupabaseConfigured } from '@/services/persistence/supabaseConfigured';
import type { LearningPathLesson } from '@/features/learning/services/LearningService';
import type { LearningPhaseNumber } from '@/features/learning/constants/learningPhases';
import type { AreaId } from '@/shared/constants';
import LearningSupabaseService from '@/services/supabase/LearningSupabaseService';

const CACHE_STORAGE_KEY = 'icfes_learning_catalog_v2';
const CACHE_TTL_MS = 20 * 60 * 1000;

type CatalogCachePayload = {
  fetchedAt: number;
  phase?: LearningPhaseNumber;
  lessonsByArea: Partial<Record<AreaId, LearningPathLesson[]>>;
};

let memoryCache: CatalogCachePayload | null = null;

function readSessionCache(): CatalogCachePayload | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = sessionStorage.getItem(CACHE_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as CatalogCachePayload;
    if (!parsed?.fetchedAt || !parsed.lessonsByArea) return null;
    if (Date.now() - parsed.fetchedAt > CACHE_TTL_MS) return null;
    return parsed;
  } catch {
    return null;
  }
}

function writeSessionCache(payload: CatalogCachePayload): void {
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.setItem(CACHE_STORAGE_KEY, JSON.stringify(payload));
  } catch {
    // quota exceeded — memory cache sigue válido
  }
}

function isCacheFresh(cache: CatalogCachePayload | null, phase?: LearningPhaseNumber): cache is CatalogCachePayload {
  return Boolean(cache && Date.now() - cache.fetchedAt <= CACHE_TTL_MS && cache.phase === phase);
}

let fetchInFlight: Promise<Partial<Record<AreaId, LearningPathLesson[]>>> | null = null;
let fetchPhaseInFlight: LearningPhaseNumber | undefined;

async function fetchCatalogFromSupabase(
  phase?: LearningPhaseNumber
): Promise<Partial<Record<AreaId, LearningPathLesson[]>>> {
  if (!isSupabaseConfigured() || !supabase) return {};
  return LearningSupabaseService.fetchPublishedRoadmapCatalog(phase);
}

/** Invalida cache en memoria y sessionStorage (p. ej. tras publicar contenido en admin). */
export function invalidateLearningCatalogCache(): void {
  memoryCache = null;
  fetchInFlight = null;
  if (typeof window !== 'undefined') {
    try {
      sessionStorage.removeItem(CACHE_STORAGE_KEY);
    } catch {
      // ignore
    }
  }
}

/** Catálogo de lecciones agrupado por área — 1 query Supabase, cache 20 min. */
export async function fetchLearningCatalog(
  options: { phase?: LearningPhaseNumber } = {}
): Promise<Partial<Record<AreaId, LearningPathLesson[]>>> {
  const { phase } = options;

  if (isCacheFresh(memoryCache, phase)) return memoryCache.lessonsByArea;

  const session = readSessionCache();
  if (isCacheFresh(session, phase)) {
    memoryCache = session;
    return session.lessonsByArea;
  }

  if (fetchInFlight && fetchPhaseInFlight === phase) return fetchInFlight;

  fetchPhaseInFlight = phase;
  fetchInFlight = fetchCatalogFromSupabase(phase)
    .then((lessonsByArea) => {
      const payload: CatalogCachePayload = { fetchedAt: Date.now(), phase, lessonsByArea };
      memoryCache = payload;
      writeSessionCache(payload);
      return lessonsByArea;
    })
    .finally(() => {
      fetchInFlight = null;
      fetchPhaseInFlight = undefined;
    });

  return fetchInFlight;
}

export async function getLearningPathFromCatalog(
  areaId: AreaId,
  phase?: LearningPhaseNumber
): Promise<LearningPathLesson[]> {
  const catalog = await fetchLearningCatalog({ phase });
  const lessons = catalog[areaId] ?? [];
  if (phase === undefined) return [...lessons];
  return lessons.filter((lesson) => lesson.phase === phase);
}
