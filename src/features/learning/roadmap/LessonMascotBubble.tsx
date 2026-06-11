import type { StaticImageData } from 'next/image';
import { cn } from '@/utils/cn';
import { MascotaCircle } from '@/shared/components/MascotaCircle';

type LessonMascotBubbleProps = {
  text: string;
  mascotSrc: string | StaticImageData;
  bubbleBorder: string;
  className?: string;
};

export function LessonMascotBubble({ text, mascotSrc, bubbleBorder, className }: LessonMascotBubbleProps) {
  return (
    <div
      className={cn(
        'mx-auto flex w-full max-w-2xl flex-col items-center gap-4',
        'sm:flex-row sm:items-start sm:justify-center sm:gap-5',
        className
      )}
    >
      <div className="shrink-0" style={{ animation: 'float 3s ease-in-out infinite' }}>
        <MascotaCircle src={mascotSrc} alt="Mascota" size="md" centered={false} />
      </div>

      <div className="relative w-full max-w-md min-w-0">
        <div
          className={cn(
            'absolute -top-2 left-1/2 h-0 w-0 -translate-x-1/2 border-[10px]',
            'border-transparent border-b-on-surface-muted sm:hidden'
          )}
          aria-hidden
        />
        <div
          className={cn(
            'absolute top-8 -left-2 hidden h-0 w-0 sm:block',
            'border-[10px] border-transparent border-r-on-surface-muted'
          )}
          aria-hidden
        />
        <div className={cn('rounded-2xl border-2 bg-surface-overlay/95 p-4 shadow-xl backdrop-blur-sm sm:p-5', bubbleBorder)}>
          <p className="text-center text-base leading-relaxed font-semibold text-white sm:text-left sm:text-lg">
            {text}
          </p>
        </div>
      </div>
    </div>
  );
}
