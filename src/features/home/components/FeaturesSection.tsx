import { Icon } from '@/shared/components/Icon';
import { cn } from '@/utils/cn';
import { WHY_CHOOSE_US } from '@/features/home/data';
import { AnimatedReveal } from '@/shared/components/AnimatedReveal';

import { RefObject } from 'react';

export const FeaturesSection = ({
  whyChooseSection,
}: {
  whyChooseSection: {
    elementRef: RefObject<null>;
    isVisible: boolean;
  };
}) => {
  return (
    <section ref={whyChooseSection.elementRef} className="mx-auto max-w-7xl px-6 py-20 md:px-8">
      <AnimatedReveal isVisible={whyChooseSection.isVisible} className="mb-16 text-center">
        <h2 className="mb-4 text-4xl font-bold md:text-5xl">¿Por Qué Somos la Mejor Opción?</h2>
        <p className="text-lg text-slate-400">Características que te harán decir "esto es lo mejor que existe"</p>
      </AnimatedReveal>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {WHY_CHOOSE_US.map((feature, idx) => (
          <AnimatedReveal
            key={idx}
            isVisible={whyChooseSection.isVisible}
            delay={idx * 0.12}
            className={cn(
              'group rounded-xl border border-slate-700 p-8 transition-all duration-300',
              'hover:scale-105 hover:border-slate-500 hover:shadow-lg',
              `bg-linear-to-br ${feature.color}`
            )}
          >
            <div className="mb-4 text-5xl text-white transition-transform group-hover:scale-110">
              <Icon name={feature.icon} size="2xl" />
            </div>
            <h3 className="mb-3 text-xl font-bold text-white">{feature.title}</h3>
            <p className="text-white/80">{feature.description}</p>
          </AnimatedReveal>
        ))}
      </div>
    </section>
  );
};
