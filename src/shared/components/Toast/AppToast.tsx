'use client';

import { cn } from '@/utils/cn';
import { Icon } from '@/shared/components/Icon';

export type ToastType = 'success' | 'error';

export type ToastState = {
  message: string;
  type: ToastType;
};

type AppToastProps = {
  toast: ToastState;
  onDismiss: () => void;
};

export function AppToast({ toast, onDismiss }: AppToastProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        'animate-fade-in-up motion-reduce:animate-none fixed top-20 right-4 z-[60] max-w-sm rounded-xl border p-4 shadow-xl backdrop-blur-md',
        toast.type === 'success'
          ? cn(
              'border-green-600/30 bg-green-100 text-green-900 dark:border-green-500/30',
              'dark:bg-green-500/10 dark:text-green-300'
            )
          : 'border-red-600/30 bg-red-100 text-red-900 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300'
      )}
    >
      <div className="flex items-center gap-3">
        <Icon name={toast.type === 'success' ? 'check-circle' : 'warning'} />
        <p className="text-sm font-medium">{toast.message}</p>
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Cerrar aviso"
          className={cn(
            'text-on-surface-muted hover:text-on-surface ml-auto cursor-pointer rounded-full p-1 transition-colors'
          )}
        >
          <Icon name="times" size="sm" />
        </button>
      </div>
    </div>
  );
}
