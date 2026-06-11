import { cn } from '@/utils/cn';
import { Icon } from '@/shared/components/Icon';
import { useGSAPModalEntrance } from '@/hooks/useGSAPModalEntrance';
import { ChatInputArea } from './ChatInputArea';
import { ChatMessageList } from './ChatMessageList';
import type { ChatMessage } from './chatTypes';

type ChatPanelProps = {
  isOpen: boolean;
  onClose: () => void;
  messages: ChatMessage[];
  isTyping: boolean;
  isAnonymous: boolean;
  anonRemaining: number;
  anonQuotaReached: boolean;
  inputValue: string;
  onInputChange: (value: string) => void;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
  inputRef: React.RefObject<HTMLInputElement | null>;
  onKeyDown: (e: React.KeyboardEvent) => void;
  onSend: () => void;
};

export function ChatPanel({
  isOpen,
  onClose,
  messages,
  isTyping,
  isAnonymous,
  anonRemaining,
  anonQuotaReached,
  inputValue,
  onInputChange,
  messagesEndRef,
  inputRef,
  onKeyDown,
  onSend,
}: ChatPanelProps) {
  const chatPanelRef = useGSAPModalEntrance({
    isOpen,
    type: 'slideUp',
    duration: 0.3,
  });

  const statusText = isAnonymous
    ? anonQuotaReached
      ? 'Límite de invitado alcanzado'
      : `${anonRemaining} pregunta${anonRemaining !== 1 ? 's' : ''} gratis sin cuenta`
    : 'Responde tus dudas';

  return (
    <div
      ref={chatPanelRef}
      className={cn(
        'fixed z-50 flex h-[min(500px,70vh)] flex-col overflow-hidden rounded-2xl',
        'border-app-ring/30 shadow-app-ring/20 border bg-slate-900/98 shadow-2xl backdrop-blur-xl',
        'right-3 bottom-24 left-3 w-auto',
        'sm:right-6 sm:left-auto sm:w-[min(400px,calc(100vw-3rem))]'
      )}
    >
      <div
        className={cn(
          'border-app-ring/20 from-app-accent-strong/30 flex items-center justify-between',
          'border-b bg-linear-to-r to-blue-600/30 px-4 py-3'
        )}
      >
        <div className="flex items-center gap-3">
          <div
            className={cn(
              'from-cta-from to-cta-to flex h-10 w-10 items-center justify-center',
              'rounded-full bg-linear-to-r'
            )}
          >
            <Icon name="robot" className="text-white" />
          </div>
          <div>
            <h3 className="font-bold text-white">Asistente ICFES</h3>
            <p className="text-app-accent-muted/80 text-xs">{statusText}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className={cn(
            'cursor-pointer rounded-lg p-2 text-slate-400 transition-colors hover:bg-white/10',
            'hover:text-white focus-visible:ring-app-accent focus-visible:ring-2',
            'focus-visible:ring-offset-2 focus-visible:outline-none focus-visible:ring-offset-slate-900'
          )}
          aria-label="Cerrar chat"
        >
          <Icon name="times" size="lg" />
        </button>
      </div>

      <ChatMessageList
        messages={messages}
        isTyping={isTyping}
        isAnonymous={isAnonymous}
        messagesEndRef={messagesEndRef}
      />

      <ChatInputArea
        anonQuotaReached={anonQuotaReached}
        inputValue={inputValue}
        isTyping={isTyping}
        inputRef={inputRef}
        onInputChange={onInputChange}
        onKeyDown={onKeyDown}
        onSend={onSend}
      />
    </div>
  );
}
