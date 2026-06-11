import { ChatAssistant } from '@/features/learning/shell/ChatAssistant/ChatAssistant';

export default function FasesLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <ChatAssistant />
    </>
  );
}
