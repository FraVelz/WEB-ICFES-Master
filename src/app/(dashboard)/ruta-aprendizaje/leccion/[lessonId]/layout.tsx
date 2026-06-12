import ProtectedPage from '@/components/ProtectedPage';
import { LessonRouteLayout } from '@/features/learning/pages/LessonRouteLayout';

export default function LessonLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedPage blockDemoContent={false}>
      <LessonRouteLayout>{children}</LessonRouteLayout>
    </ProtectedPage>
  );
}
