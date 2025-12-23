import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { WHY_CHOOSE_US } from "@/features/home/data";
import { getAnimationStyle } from "@/features/home/hooks/animations";

export const FeaturesSection = ({ isInitialLoad, whyChooseSection }) => {
  return (
    <section ref={whyChooseSection.elementRef} className="max-w-7xl mx-auto px-6 md:px-8 py-20">
      <div style={getAnimationStyle(whyChooseSection.isVisible, isInitialLoad)} className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-bold mb-4">¿Por Qué Somos la Mejor Opción?</h2>
        <p className="text-slate-400 text-lg">Características que te harán decir "esto es lo mejor que existe"</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {WHY_CHOOSE_US.map((feature, idx) => (
          <div
            key={idx}
            style={getAnimationStyle(whyChooseSection.isVisible, isInitialLoad, idx * 0.12)}
            className={`bg-linear-to-br ${feature.color} rounded-xl p-8 border border-slate-700 hover:border-slate-500 transition-all duration-300 hover:shadow-lg hover:scale-105 group`}
          >
            <div className="text-5xl mb-4 text-white group-hover:scale-110 transition-transform">
              <FontAwesomeIcon icon={feature.icon} />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
            <p className="text-white/80">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};
