import { Icon } from '@/shared/components/Icon';
import { FAQS } from '@/features/home/data';
import { AnimatedReveal } from '@/shared/components/AnimatedReveal';

import { RefObject } from 'react';

export const FAQSection = ({
  faqSection,
  expandedFaq,
  setExpandedFaq,
}: {
  faqSection: {
    elementRef: RefObject<null>;
    isVisible: boolean;
  };
  expandedFaq: number | null;
  setExpandedFaq: React.Dispatch<React.SetStateAction<number | null>>;
}) => {
  return (
    <section
      ref={faqSection.elementRef}
      className="mx-auto max-w-4xl px-6 py-20 md:px-8"
    >
      <AnimatedReveal
        isVisible={faqSection.isVisible}
        className="mb-16 text-center"
      >
        <h2 className="mb-4 text-4xl font-bold md:text-5xl">
          Preguntas Frecuentes
        </h2>
      </AnimatedReveal>

      <div className="space-y-4">
        {FAQS.map((faq, idx) => (
          <AnimatedReveal
            key={idx}
            isVisible={faqSection.isVisible}
            delay={idx * 0.12}
            className="overflow-hidden rounded-lg border border-slate-700 bg-slate-800"
          >
            <button
              onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
              className="flex w-full cursor-pointer items-center justify-between gap-3 p-6 transition-colors hover:bg-slate-700/50"
            >
              <p className="text-left text-lg font-bold text-white">{faq.q}</p>
              <Icon
                name="chevron-right"
                className={`text-slate-400 transition-transform ${expandedFaq === idx ? 'rotate-90' : ''}`}
              />
            </button>
            {expandedFaq === idx && (
              <div className="border-t border-slate-700 bg-slate-700/20 px-6 pt-3 pb-6 text-slate-300">
                {faq.a}
              </div>
            )}
          </AnimatedReveal>
        ))}
      </div>
    </section>
  );
};
