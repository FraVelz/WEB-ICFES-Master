import { Icon } from '@/shared/components/Icon';
import { TESTIMONIALS } from '@/features/home/data';
import { AnimatedReveal } from '@/shared/components/AnimatedReveal';

import { RefObject } from 'react';

export const TestimonialsSection = ({
  isInitialLoad,
  testimonialSection,
}: {
  isInitialLoad: boolean;
  testimonialSection: {
    elementRef: RefObject<null>;
    isVisible: boolean;
  };
}) => {
  return (
    <section
      ref={testimonialSection.elementRef}
      className="mx-auto max-w-7xl px-6 py-20 md:px-8"
    >
      <AnimatedReveal
        isVisible={testimonialSection.isVisible}
        isInitialLoad={isInitialLoad}
        className="mb-16 text-center"
      >
        <h2 className="mb-4 text-4xl font-bold md:text-5xl">
          Historias de Éxito
        </h2>
        <p className="text-lg text-slate-400">
          Estudiantes reales que ya alcanzaron +400
        </p>
      </AnimatedReveal>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {TESTIMONIALS.map((testimonial, idx) => (
          <AnimatedReveal
            key={idx}
            isVisible={testimonialSection.isVisible}
            isInitialLoad={isInitialLoad}
            delay={idx * 0.15}
            className="rounded-lg border border-slate-700 bg-slate-800/50 p-6 transition-all duration-300 hover:border-slate-600 hover:shadow-lg"
          >
            <div className="mb-4 flex items-center gap-2">
              <Icon name="trophy" className="text-xl text-amber-400" />
              <span className="text-2xl font-bold text-amber-400">
                {testimonial.score}
              </span>
            </div>
            <p className="mb-4 text-slate-300 italic">"{testimonial.text}"</p>
            <p className="font-bold text-white">{testimonial.name}</p>
            <p className="text-sm text-slate-400">{testimonial.area}</p>
          </AnimatedReveal>
        ))}
      </div>
    </section>
  );
};
