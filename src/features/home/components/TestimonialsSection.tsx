import { cn } from '@/utils/cn';
import { Icon } from '@/shared/components/Icon';
import { TESTIMONIALS } from '@/features/home/data';

export const TestimonialsSection = () => {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20 md:px-8">
      <div className="mb-16 text-center">
        <h2 className="mb-4 text-4xl font-bold md:text-5xl">Historias de Éxito</h2>
        <p className="text-on-surface-muted text-lg">Estudiantes reales que ya alcanzaron +400</p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {TESTIMONIALS.map((testimonial, idx) => (
          <div
            key={idx}
            className={cn(
              'border-surface-border bg-surface-elevated/80 rounded-lg border p-6 transition-all duration-300',
              'hover:border-surface-border hover:shadow-lg'
            )}
          >
            <div className="mb-4 flex items-center gap-2">
              <Icon name="trophy" className="text-xl text-amber-400" />
              <span className="text-2xl font-bold text-amber-400">{testimonial.score}</span>
            </div>
            <p className="text-on-surface-muted mb-4 italic">"{testimonial.text}"</p>
            <p className="text-on-surface font-bold">{testimonial.name}</p>
            <p className="text-on-surface-muted text-sm">{testimonial.area}</p>
          </div>
        ))}
      </div>
    </section>
  );
};
