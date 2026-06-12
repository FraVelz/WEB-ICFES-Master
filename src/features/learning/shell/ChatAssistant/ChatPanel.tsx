import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/utils/cn';
import { Icon } from '@/shared/components/Icon';
import { ModalOverlay } from '@/shared/components/ModalOverlay';
import { useDialogA11y } from '@/shared/hooks/useDialogA11y';
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
  requiresLogin: boolean;
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
  requiresLogin,
  inputValue,
  onInputChange,
  messagesEndRef,
  inputRef,
  onKeyDown,
  onSend,
}: ChatPanelProps) {
  const [mounted, setMounted] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const chatPanelRef = useGSAPModalEntrance({
    isOpen,
    type: 'slideUp',
    duration: 0.3,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useDialogA11y(isOpen, onClose, dialogRef, { lockScroll: false });

  const statusText = requiresLogin
    ? 'Inicia sesión para usar el asistente'
    : 'Responde tus dudas';

  if (!mounted || !isOpen) return null;

  return createPortal(
    <>
      <ModalOverlay onClose={onClose} className="z-90 bg-black/25 backdrop-blur-[1px]" />

      <div
        ref={(node) => {
          dialogRef.current = node;
          if (chatPanelRef && typeof chatPanelRef === 'object' && 'current' in chatPanelRef) {
            chatPanelRef.current = node;
          }
        }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="chat-panel-title"
        className={cn(
          'fixed z-100 flex h-[min(500px,70vh)] flex-col overflow-hidden rounded-2xl',
          'border-app-ring/30 shadow-app-ring/20 bg-surface-elevated/98 border shadow-2xl backdrop-blur-xl',
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
              <h3 id="chat-panel-title" className="text-on-surface font-bold">
                Asistente ICFES
              </h3>
              <p className="text-app-accent-muted/80 text-xs">{statusText}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className={cn(
              'text-on-surface-muted hover:bg-surface/10 cursor-pointer rounded-lg p-2 transition-colors',
              'focus-visible:ring-app-accent hover:text-on-surface focus-visible:ring-2',
              'focus-visible:ring-offset-surface-elevated focus-visible:ring-offset-2 focus-visible:outline-none'
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
          requiresLogin={requiresLogin}
          inputValue={inputValue}
          isTyping={isTyping}
          inputRef={inputRef}
          onInputChange={onInputChange}
          onKeyDown={onKeyDown}
          onSend={onSend}
        />
      </div>
    </>,
    document.body
  );
}
