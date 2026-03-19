import { Icon } from "@/shared/components/Icon";
import { FAQS } from "@/features/home/data";
import { AnimatedReveal } from "@/shared/components/AnimatedReveal";

export const FAQSection = ({ isInitialLoad, faqSection, expandedFaq, setExpandedFaq }:
  {
    isInitialLoad: boolean;
    faqSection: any;
    expandedFaq: number | null;
    setExpandedFaq: React.Dispatch<React.SetStateAction<number | null>>;
  }
) => {
  return (
    <section ref={faqSection.elementRef} className="max-w-4xl mx-auto px-6 md:px-8 py-20">
      <AnimatedReveal isVisible={faqSection.isVisible} isInitialLoad={isInitialLoad} className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-bold mb-4">Preguntas Frecuentes</h2>
      </AnimatedReveal>

      <div className="space-y-4">
        {FAQS.map((faq, idx) => (
          <AnimatedReveal
            key={idx}
            isVisible={faqSection.isVisible}
            isInitialLoad={isInitialLoad}
            delay={idx * 0.12}
            className="bg-slate-800 border border-slate-700 rounded-lg overflow-hidden"
          >
            <button
              onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
              className="cursor-pointer w-full p-6 flex items-center justify-between gap-3 hover:bg-slate-700/50 transition-colors"
            >
              <p className="text-lg font-bold text-white text-left">{faq.q}</p>
              <Icon 
                name="chevron-right"
                className={`text-slate-400 transition-transform ${expandedFaq === idx ? 'rotate-90' : ''}`}
              />
            </button>
            {expandedFaq === idx && (
              <div className="px-6 pt-3 pb-6 bg-slate-700/20 text-slate-300 border-t border-slate-700">
                {faq.a}
              </div>
            )}
          </AnimatedReveal>
        ))}
      </div>
    </section>
  );
};
