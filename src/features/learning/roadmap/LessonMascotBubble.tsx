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
    <div className={cn('sm:items-flex-start flex flex-col items-center gap-4 sm:flex-row sm:justify-center sm:gap-6', className)}>
      <div className="shrink-0 sm:order-2" style={{ animation: 'float 3s ease-in-out infinite' }}>
        <MascotaCircle src={mascotSrc} alt="Mascota" size="md" centered={false} />
      </div>

      <div className="relative w-full max-w-sm sm:order-1 sm:max-w-md sm:flex-1">
        <div
          className={cn(
            'absolute top-full left-1/2 h-0 w-0 -translate-x-1/2 -translate-y-px border-[10px]',
            'border-transparent border-t-slate-800 sm:top-1/2 sm:right-auto sm:left-full',
            'sm:translate-x-0 sm:-translate-y-1/2 sm:border-t-transparent sm:border-r-slate-800'
          )}
          aria-hidden
        />
        <div
          className={cn(
            'rounded-2xl border-2 bg-slate-800/95 p-4 shadow-xl backdrop-blur-sm sm:p-5',
            bubbleBorder
          )}
        >
          <p className="text-center text-base leading-relaxed font-semibold text-white sm:text-left sm:text-lg">
            {text}
          </p>
        </div>
      </div>
    </div>
  );
}
