import { TipsCategoriesSectionsExam } from './TipsCategoriesSectionsExam';
import { TipsCategoriesSectionsStudy } from './TipsCategoriesSectionsStudy';
import type { ContentVariant } from '@/features/content/components/ContentPageShell';

type TipsCategoriesSectionsProps = {
  variant?: ContentVariant;
};

export function TipsCategoriesSections({ variant = 'full' }: TipsCategoriesSectionsProps) {
  const previewLimit = variant === 'public' ? 2 : undefined;

  return (
    <>
      <TipsCategoriesSectionsStudy previewLimit={previewLimit} />
      <TipsCategoriesSectionsExam previewLimit={previewLimit} />
    </>
  );
}
