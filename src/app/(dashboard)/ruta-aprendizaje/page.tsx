import ProtectedPage from '@/components/ProtectedPage';

import { LearningRoadmapPage } from '@/features/learning';

export default function Page() {
  return (
    <ProtectedPage blockDemoContent={false}>
      <LearningRoadmapPage />
    </ProtectedPage>
  );
}
