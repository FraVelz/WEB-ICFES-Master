'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/utils/cn';
import { Icon } from '@/shared/components/Icon';
import { FAQS } from '@/features/home/data';
import { ScrollTrigger } from '@/lib/gsap';

export const FAQSection = () => {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  useEffect(() => {
    ScrollTrigger.refresh();
  }, [expandedFaq]);

  return (
    <section className="mx-auto max-w-4xl px-6 py-20 md:px-8">
      <div className="mb-16 text-center">
        <h2 className="mb-4 text-4xl font-bold md:text-5xl">Preguntas Frecuentes</h2>
      </div>

      <div className="space-y-4">
        {FAQS.map((faq, idx) => (
          <div key={idx} className="border-surface-border bg-surface-elevated overflow-hidden rounded-lg border">
            <button
              type="button"
              onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
              className={cn(
                'hover:bg-surface-border/30 flex w-full cursor-pointer items-center justify-between',
                'gap-3 p-6 transition-colors',
                'focus-visible:ring-app-accent focus-visible:ring-2 focus-visible:outline-none focus-visible:ring-inset'
              )}
            >
              <p className="text-on-surface text-left text-lg font-bold">{faq.q}</p>
              <Icon
                name="chevron-right"
                className={cn('text-on-surface-muted transition-transform', expandedFaq === idx && 'rotate-90')}
              />
            </button>
            {expandedFaq === idx && (
              <div className="border-surface-border bg-surface-border/20 text-on-surface-muted border-t px-6 pt-3 pb-6">
                {faq.a}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};
