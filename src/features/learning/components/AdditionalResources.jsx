import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBook } from '@fortawesome/free-solid-svg-icons';

export const AdditionalResources = () => {
  return (
    <section className="mb-24">
      <div className="bg-linear-to-br from-blue-600 via-purple-600 to-cyan-600 sm:rounded-3xl p-12 shadow-2xl sm:mx-6 sm:border-4 border-cyan-400">
        <h2 className="text-4xl font-black text-white mb-6 drop-shadow-lg">
          <FontAwesomeIcon icon={faBook} className="mr-4 text-cyan-300" />
          Recursos Adicionales
        </h2>
        <p className="text-lg text-blue-100 mb-8 leading-relaxed max-w-3xl">
          Descarga nuestros materiales de estudio en PDF, videos tutoriales y ejercicios interactivos diseñados para maximizar tu comprensión
        </p>
        <div className="flex gap-4 flex-wrap">
          <button className="cursor-pointer bg-white text-blue-600 font-semibold py-3 px-8 rounded-xl hover:bg-gray-100 transition-all duration-300 hover:shadow-lg hover:scale-105">
            Descargar PDFs
          </button>
          <button className="cursor-pointer bg-white/20 text-white border-2 border-white font-semibold py-3 px-8 rounded-xl hover:bg-white/30 transition-all duration-300 hover:shadow-lg hover:scale-105">
            Ver Videos
          </button>
        </div>
      </div>
    </section>
  );
};
