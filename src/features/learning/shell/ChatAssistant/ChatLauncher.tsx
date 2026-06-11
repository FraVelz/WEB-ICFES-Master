import { cn } from '@/utils/cn';
import { Icon } from '@/shared/components/Icon';

type ChatLauncherProps = {
  isOpen: boolean;
  onToggle: () => void;
};

export function ChatLauncher({ isOpen, onToggle }: ChatLauncherProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={cn(
        'fixed bottom-28 left-6 z-10 flex h-14 w-14 cursor-pointer items-center justify-center',
        'lg:right-6 lg:bottom-6 lg:left-auto',
        'border-app-accent/50 from-cta-from to-cta-to rounded-full border-2 bg-linear-to-r',
        'shadow-app-ring/30 text-white shadow-lg transition-all duration-300 hover:scale-110',
        'hover:shadow-app-ring/50 focus-visible:ring-app-accent focus-visible:ring-2',
        'focus-visible:outline-none focus-visible:ring-offset-4 focus-visible:ring-offset-slate-950'
      )}
      aria-label={isOpen ? 'Cerrar asistente de chat' : 'Abrir asistente de chat'}
    >
      <Icon name="message" size="xl" />
    </button>
  );
}
