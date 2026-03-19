import { Icon } from "@/shared/components/Icon";
import { TESTIMONIALS } from "@/features/home/data";
import { getAnimationStyle } from "@/features/home/hooks/animations";

export const TestimonialsSection = ({ isInitialLoad, testimonialSection }) => {
  return (
    <section ref={testimonialSection.elementRef} className="max-w-7xl mx-auto px-6 md:px-8 py-20">
      <div style={getAnimationStyle(testimonialSection.isVisible, isInitialLoad)} className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-bold mb-4">Historias de Éxito</h2>
        <p className="text-slate-400 text-lg">Estudiantes reales que ya alcanzaron +400</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {TESTIMONIALS.map((testimonial, idx) => (
          <div
            key={idx}
            style={getAnimationStyle(testimonialSection.isVisible, isInitialLoad, idx * 0.15)}
            className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 hover:border-slate-600 transition-all duration-300 hover:shadow-lg"
          >
            <div className="flex items-center gap-2 mb-4">
              <Icon name="trophy" className="text-amber-400 text-xl" />
              <span className="text-2xl font-bold text-amber-400">{testimonial.score}</span>
            </div>
            <p className="text-slate-300 mb-4 italic">"{testimonial.text}"</p>
            <p className="font-bold text-white">{testimonial.name}</p>
            <p className="text-sm text-slate-400">{testimonial.area}</p>
          </div>
        ))}
      </div>
    </section>
  );
};
