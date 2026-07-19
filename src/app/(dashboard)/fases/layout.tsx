import { isOpenAIEnabled } from '@/config/featureFlags';
import { ChatAssistant } from '@/features/learning/shell/ChatAssistant/ChatAssistant';

export default function FasesLayout({ children }: { children: React.ReactNode }) {
  const openaiEnabled = isOpenAIEnabled();

  return (
    <>
      {children}
      {openaiEnabled ? <ChatAssistant /> : null}
    </>
  );
}
