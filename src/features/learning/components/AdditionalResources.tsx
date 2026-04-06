import { cn } from '@/utils/cn';
import { Icon } from '@/shared/components/Icon';

export const AdditionalResources = () => {
  return (
    <section className="mb-24">
      <div
        className={cn(
          'border-cyan-400 bg-linear-to-br from-blue-600 via-purple-600 to-cyan-600 p-12 shadow-2xl',
          'sm:mx-6 sm:rounded-3xl sm:border-4'
        )}
      >
        <h2 className="mb-6 text-4xl font-black text-white drop-shadow-lg">
          <Icon name="book" size="xl" className="mr-4 text-cyan-300" />
          Recursos Adicionales
        </h2>
        <p className="mb-8 max-w-3xl text-lg leading-relaxed text-blue-100">
          Descarga nuestros materiales de estudio en PDF, videos tutoriales y ejercicios interactivos diseñados para
          maximizar tu comprensión
        </p>
        <div className="flex flex-wrap gap-4">
          <button
            className={cn(
              'cursor-pointer rounded-xl bg-white px-8 py-3 font-semibold text-blue-600 transition-all',
              'duration-300 hover:scale-105 hover:bg-gray-100 hover:shadow-lg'
            )}
          >
            Descargar PDFs
          </button>
          <button
            className={cn(
              'cursor-pointer rounded-xl border-2 border-white bg-white/20 px-8 py-3 font-semibold',
              'text-white transition-all duration-300 hover:scale-105 hover:bg-white/30 hover:shadow-lg'
            )}
          >
            Ver Videos
          </button>
        </div>
      </div>
    </section>
  );
};
