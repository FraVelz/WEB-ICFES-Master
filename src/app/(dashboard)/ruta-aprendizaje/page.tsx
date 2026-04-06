import DemoProtectedPage from '@/components/DemoProtectedPage';

import { LearningRoadmapPage } from '@/features/learning';

export default function Page() {
  return (
    <DemoProtectedPage>
      <LearningRoadmapPage />
    </DemoProtectedPage>
  );
}
