import { cn } from '@/utils/cn';
import { MASCOT_IMAGES } from '@/assets';
import { EmptyState } from '@/shared/components/EmptyState';
import { LessonMascotBubble } from './LessonMascotBubble';
import { LessonRichContent } from './LessonRichContent';
import type { LessonVisual } from './lessonVisualTypes';

type LessonContentSectionProps = {
  sectionsCount: number;
  currentSection: number;
  mascotDialogue: string;
  bubbleBorder: string;
  contentToRender: string;
  visuals?: LessonVisual[];
  sectionInnerClass: string;
};

export function LessonContentSection({
  sectionsCount,
  currentSection,
  mascotDialogue,
  bubbleBorder,
  contentToRender,
  visuals,
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
            'bg-surface-overlay/80 rounded-full px-3 py-1 text-xs font-semibold tracking-wider',
            'text-on-surface-muted uppercase'
          )}
        >
          {hasSections ? `${currentSection + 1} de ${sectionsCount}` : 'Lección'}
        </span>
      </div>

      {hasSections ? (
        <div className="border-surface-border/60 bg-surface-elevated/30 rounded-2xl border p-4 sm:p-6 md:p-8">
          <LessonRichContent content={markdownContent} visuals={visuals} />
        </div>
      ) : (
        <EmptyState
          icon="book-open"
          title="Sin contenido"
          description="No hay contenido disponible para esta lección todavía."
          className="border-surface-border/60 bg-surface-elevated/30"
        />
      )}
    </div>
  );
}
