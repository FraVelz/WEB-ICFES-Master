import DemoProtectedPage from '@/components/DemoProtectedPage';

import { ChatAssistant, LearningRoadmapPage } from '@/features/learning';

export default function Page() {
  return (
    <DemoProtectedPage>
      <LearningRoadmapPage />
      <ChatAssistant />
    </DemoProtectedPage>
  );
}
