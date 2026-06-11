import ReactMarkdown from 'react-markdown';
import rehypeSanitize from 'rehype-sanitize';
import { cn } from '@/utils/cn';
import { Icon } from '@/shared/components/Icon';
import { CHAT_ANON_LIMIT } from '@/features/learning/constants/chatAnonQuota';
import type { ChatMessage } from './chatTypes';

type ChatMessageListProps = {
  messages: ChatMessage[];
  isTyping: boolean;
  isAnonymous: boolean;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
};

export function ChatMessageList({ messages, isTyping, isAnonymous, messagesEndRef }: ChatMessageListProps) {
  return (
    <div className="custom-scrollbar min-h-0 flex-1 space-y-4 overflow-y-auto p-3 sm:p-4">
      {messages.length === 0 && (
        <div className="flex h-full flex-col items-center justify-center px-4 text-center">
          <div className="bg-app-ring/20 mb-4 flex h-16 w-16 items-center justify-center rounded-full">
            <Icon name="message" size="xl" className="text-app-accent" />
          </div>
          <p className="mb-2 text-sm text-on-surface-muted">¿Tienes preguntas sobre el ICFES?</p>
          <p className="text-xs text-on-surface-muted">
            {isAnonymous
              ? `Sin cuenta puedes hacer hasta ${CHAT_ANON_LIMIT} preguntas.`
              : 'Escribe aquí y te ayudaré con tus dudas'}
          </p>
        </div>
      )}

      {messages.map((msg) => (
        <div key={msg.id} className={cn('flex gap-3', msg.role === 'user' && 'flex-row-reverse')}>
          <div
            className={cn(
              'flex h-8 w-8 shrink-0 items-center justify-center rounded-full',
              msg.role === 'user' ? 'bg-ambient-a/30' : 'bg-app-ring/30'
            )}
          >
            <Icon
              name={msg.role === 'user' ? 'user' : 'robot'}
              className={msg.role === 'user' ? 'text-blue-400' : 'text-app-accent'}
            />
          </div>
          <div
            className={cn(
              'max-w-[85%] rounded-2xl px-4 py-2.5',
              msg.role === 'user'
                ? 'bg-ambient-a/30 rounded-br-md border border-blue-500/30'
                : 'rounded-bl-md border border-surface-border/50 bg-surface-overlay/80'
            )}
          >
            {msg.role === 'assistant' ? (
              <div
                className={cn(
                  'text-sm leading-relaxed text-white [&_code]:rounded [&_code]:bg-on-surface-muted/50',
                  '[&_code]:px-1 [&_li]:ml-4 [&_ol]:my-2 [&_p]:my-1',
                  '[&_strong]:font-semibold [&_ul]:my-2'
                )}
              >
                <ReactMarkdown rehypePlugins={[rehypeSanitize]}>{msg.content}</ReactMarkdown>
              </div>
            ) : (
              <p className="text-sm leading-relaxed text-white">{msg.content}</p>
            )}
          </div>
        </div>
      ))}

      {isTyping && (
        <div className="flex gap-3">
          <div className="bg-app-ring/30 flex h-8 w-8 shrink-0 items-center justify-center rounded-full">
            <Icon name="robot" className="text-app-accent" />
          </div>
          <div className="rounded-2xl rounded-bl-md border border-surface-border/50 bg-surface-overlay/80 px-4 py-3">
            <div className="flex gap-1.5">
              {[0, 150, 300].map((delay) => (
                <span
                  key={delay}
                  className="bg-hub-orb h-2 w-2 animate-bounce rounded-full"
                  style={{ animationDelay: `${delay}ms` }}
                />
              ))}
            </div>
          </div>
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
}
