'use client';

import DemoProtectedPage from '@/components/DemoProtectedPage';
import { LearningRoadmapPage } from '@/features/learning/pages';
import { ChatAssistant } from '@/features/learning/components/ChatAssistant';

export default function Page() {
  return (
    <DemoProtectedPage>
      <LearningRoadmapPage />
      <ChatAssistant />
    </DemoProtectedPage>
  );
}
