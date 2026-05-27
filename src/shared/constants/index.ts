export {
  AREA_INFO,
  HOME_AREA_IDS,
  getAreaInfo,
  getHomeAreas,
  type AreaId,
  type AreaInfo,
  type HomeArea,
} from './areaInfo';
export { RANKS, getRankInfo, getNextRank, getPrevRank } from './ranks';
export {
  PRACTICA_AREA_SLUGS,
  type PracticaAreaSlug,
  isPracticaAreaSlug,
  getPracticaHrefForRoadmapArea,
} from './practiceAreas';
export {
  LESSON_ROUTE_PAIRS,
  ROADMAP_AREA_TO_LESSON_AREA,
  ROADMAP_AREA_TO_STATIC_DATA_KEY,
  type LessonAreaSlug,
  type LessonTopicSlug,
  getLessonAreaSlugForRoadmap,
  getStaticRoadmapDataKey,
  getLessonRoutesForRoadmapArea,
  buildLessonHrefFromNode,
  groupLessonRoutePairsByArea,
} from './lessonRoutes';
