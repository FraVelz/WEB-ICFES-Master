import { Icon } from '@/shared/components/Icon';
import type { ImportanciaSection as ImportanciaSectionData } from '../data/importanciaContent';

type ImportanciaSectionProps = {
  section: ImportanciaSectionData;
  nested?: boolean;
};

export function ImportanciaSection({ section, nested = false }: ImportanciaSectionProps) {
  const HeadingTag = nested ? 'h3' : 'h2';

  return (
    <section aria-labelledby={`importancia-${section.id}`} className="space-y-4">
      <div className="flex items-start gap-3">
        <div
          className={
            nested
              ? 'bg-app-ring/10 text-app-accent flex h-9 w-9 shrink-0 items-center justify-center rounded-lg'
              : 'bg-app-ring/15 text-app-accent flex h-10 w-10 shrink-0 items-center justify-center rounded-xl'
          }
        >
          <Icon name={section.icon} size={nested ? 'md' : 'lg'} />
        </div>
        <div className="min-w-0 space-y-3">
          <HeadingTag
            id={`importancia-${section.id}`}
            className={nested ? 'text-on-surface text-lg font-semibold' : 'text-on-surface text-xl font-bold'}
          >
            {section.title}
          </HeadingTag>
          {section.paragraphs.map((paragraph) => (
            <p key={paragraph} className="text-on-surface-muted leading-relaxed">
              {paragraph}
            </p>
          ))}
          {section.bullets && section.bullets.length > 0 && (
            <ul className="text-on-surface-muted list-disc space-y-2 pl-5 leading-relaxed">
              {section.bullets.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}
