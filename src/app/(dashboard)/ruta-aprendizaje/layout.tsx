import { ChatAssistant } from '@/features/learning/shell/ChatAssistant/ChatAssistant';

export default function RutaAprendizajeLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <ChatAssistant />
    </>
  );
}
