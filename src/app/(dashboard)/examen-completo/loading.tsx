import { ExamPageSkeleton } from '@/shared/components/PageSkeletons';

export default function Loading() {
  return <ExamPageSkeleton layout="page" questionCount={6} />;
}
