import { cn } from '@/utils/cn';
import { Icon } from '@/shared/components/Icon';
import { FAQS } from '@/features/home/data';

export const FAQSection = ({
  expandedFaq,
  setExpandedFaq,
}: {
  expandedFaq: number | null;
  setExpandedFaq: React.Dispatch<React.SetStateAction<number | null>>;
}) => {
  return (
    <section className="mx-auto max-w-4xl px-6 py-20 md:px-8">
      <div className="mb-16 text-center">
        <h2 className="mb-4 text-4xl font-bold md:text-5xl">Preguntas Frecuentes</h2>
      </div>

      <div className="space-y-4">
        {FAQS.map((faq, idx) => (
          <div key={idx} className="overflow-hidden rounded-lg border border-slate-700 bg-slate-800">
            <button
              type="button"
              onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
              className={cn(
                'flex w-full cursor-pointer items-center justify-between gap-3 p-6 transition-colors hover:bg-slate-700/50',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-app-accent'
              )}
            >
              <p className="text-left text-lg font-bold text-white">{faq.q}</p>
              <Icon
                name="chevron-right"
                className={cn('text-slate-400 transition-transform', expandedFaq === idx && 'rotate-90')}
              />
            </button>
            {expandedFaq === idx && (
              <div className="border-t border-slate-700 bg-slate-700/20 px-6 pt-3 pb-6 text-slate-300">{faq.a}</div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};
