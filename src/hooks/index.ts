/**
 * App-wide custom hooks barrel
 *
 * USO:
 * import { useUserData, useProgress, useGamification, useExam } from '@/hooks';
 */

export { useQuizLogic } from '@/features/exam/hooks/useQuizLogic';
export { useUser } from '@/features/user/hooks/useUser';
export { useUserData } from '@/features/user/hooks/useUserData';
export { useProgress } from '@/features/progress/hooks/useProgress';
export { useGamification } from '@/features/logros/hooks/useGamification';
export { useExam } from '@/features/exam/hooks/useExam';

export { useIsMobile } from './useIsMobile';
export { useScrollAnimation } from './useScrollAnimation';
