import { cn } from '@/utils/cn';
import { MASCOT_IMAGES } from '@/assets';
import { LessonMascotBubble } from './LessonMascotBubble';
import { LessonMarkdownBody } from './LessonMarkdownBody';

type LessonContentSectionProps = {
  sectionsCount: number;
  currentSection: number;
  mascotDialogue: string;
  bubbleBorder: string;
  contentToRender: string;
  sectionInnerClass: string;
};

export function LessonContentSection({
  sectionsCount,
  currentSection,
  mascotDialogue,
  bubbleBorder,
  contentToRender,
  sectionInnerClass,
}: LessonContentSectionProps) {
  const hasSections = sectionsCount > 0;
  const markdownContent = String(contentToRender || '_No hay contenido disponible para esta lección._');

  return (
    <div className={cn(sectionInnerClass, 'py-4 sm:py-6')}>
      <LessonMascotBubble
        className="mb-6 sm:mb-8"
        text={mascotDialogue}
        mascotSrc={MASCOT_IMAGES.logo}
        bubbleBorder={bubbleBorder}
      />

      <div className="mb-4 flex justify-center sm:mb-6">
        <span
          className={cn(
            'rounded-full bg-slate-800/80 px-3 py-1 text-xs font-semibold tracking-wider',
            'text-slate-400 uppercase'
          )}
        >
          {hasSections ? `${currentSection + 1} de ${sectionsCount}` : 'Lección'}
        </span>
      </div>

      {hasSections ? (
        <div className="rounded-2xl border border-slate-700/60 bg-slate-900/30 p-4 sm:p-6 md:p-8">
          <LessonMarkdownBody content={markdownContent} />
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-700/60 bg-slate-900/30 p-4 text-center sm:p-6">
          <p className="text-sm text-slate-400 sm:text-base">No hay contenido disponible para esta lección.</p>
        </div>
      )}
    </div>
  );
}
