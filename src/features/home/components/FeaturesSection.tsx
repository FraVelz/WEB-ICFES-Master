import { Icon } from "@/shared/components/Icon";
import { WHY_CHOOSE_US } from "@/features/home/data";
import { AnimatedReveal } from "@/shared/components/AnimatedReveal";

export const FeaturesSection = ({ isInitialLoad, whyChooseSection }) => {
  return (
    <section ref={whyChooseSection.elementRef} className="max-w-7xl mx-auto px-6 md:px-8 py-20">
      <AnimatedReveal isVisible={whyChooseSection.isVisible} isInitialLoad={isInitialLoad} className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-bold mb-4">¿Por Qué Somos la Mejor Opción?</h2>
        <p className="text-slate-400 text-lg">Características que te harán decir "esto es lo mejor que existe"</p>
      </AnimatedReveal>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {WHY_CHOOSE_US.map((feature, idx) => (
          <AnimatedReveal
            key={idx}
            isVisible={whyChooseSection.isVisible}
            isInitialLoad={isInitialLoad}
            delay={idx * 0.12}
            className={`bg-linear-to-br ${feature.color} rounded-xl p-8 border border-slate-700 hover:border-slate-500 transition-all duration-300 hover:shadow-lg hover:scale-105 group`}
          >
            <div className="text-5xl mb-4 text-white group-hover:scale-110 transition-transform">
              <Icon name={feature.icon} size="2xl" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
            <p className="text-white/80">{feature.description}</p>
          </AnimatedReveal>
        ))}
      </div>
    </section>
  );
};
