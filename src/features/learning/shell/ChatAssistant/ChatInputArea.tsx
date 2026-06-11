import Link from 'next/link';
import { cn } from '@/utils/cn';
import { Icon } from '@/shared/components/Icon';
import { CHAT_ANON_LIMIT } from '@/features/learning/constants/chatAnonQuota';

type ChatInputAreaProps = {
  anonQuotaReached: boolean;
  inputValue: string;
  isTyping: boolean;
  inputRef: React.RefObject<HTMLInputElement | null>;
  onInputChange: (value: string) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  onSend: () => void;
};

export function ChatInputArea({
  anonQuotaReached,
  inputValue,
  isTyping,
  inputRef,
  onInputChange,
  onKeyDown,
  onSend,
}: ChatInputAreaProps) {
  const loginLinkClass = cn(
    'text-app-accent hover:text-app-accent-muted rounded font-semibold underline',
    'focus-visible:ring-app-accent focus-visible:ring-2 focus-visible:ring-offset-2',
    'focus-visible:outline-none focus-visible:ring-offset-slate-900'
  );

  return (
    <div className="min-w-0 border-t border-slate-700/50 bg-slate-900/50 p-3 sm:p-4">
      {anonQuotaReached ? (
        <p className="text-center text-sm text-slate-300">
          Has usado las {CHAT_ANON_LIMIT} preguntas gratis.{' '}
          <Link href="/login" className={loginLinkClass}>
            Inicia sesión
          </Link>{' '}
          para seguir.
        </p>
      ) : (
        <div className="flex min-w-0 items-stretch gap-2">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => onInputChange(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Escribe tu pregunta..."
            disabled={isTyping}
            className={cn(
              'min-w-0 flex-1 rounded-xl border border-slate-600 bg-slate-800 px-3 py-2.5 text-sm',
              'text-white sm:px-4 sm:py-3 sm:text-base',
              'focus:border-app-ring placeholder-slate-500 transition-all focus:ring-2',
              'focus:ring-app-ring/30 focus:outline-none disabled:opacity-60'
            )}
          />
          <button
            type="button"
            onClick={onSend}
            disabled={!inputValue.trim() || isTyping}
            aria-label="Enviar mensaje"
            className={cn(
              'from-cta-from to-cta-to shrink-0 cursor-pointer rounded-xl bg-linear-to-r px-3 py-2.5',
              'text-white sm:px-4 sm:py-3',
              'hover:from-app-accent-strong transition-all hover:to-blue-700',
              'disabled:cursor-not-allowed disabled:opacity-50',
              'focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none',
              'focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900'
            )}
          >
            <Icon name="paper-plane" />
          </button>
        </div>
      )}
    </div>
  );
}
