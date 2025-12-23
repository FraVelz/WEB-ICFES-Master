import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRocket } from "@fortawesome/free-solid-svg-icons";

export const FinalCTASection = () => {
  return (
    <section className="max-w-6xl mx-auto px-6 md:px-8 py-20 text-center">
      <div className="bg-linear-to-r from-cyan-600/30 via-purple-600/30 to-pink-600/30 border border-cyan-500/50 rounded-xl p-12 md:p-16">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
          ¿Listo para sacar 500?
        </h2>
        <p className="text-lg text-slate-300 max-w-2xl mx-auto mb-8">
          Miles de estudiantes ya están preparándose. Cada día que esperes es un día menos de preparación.
        </p>
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 px-10 py-4 bg-linear-to-r from-cyan-500 to-blue-600 text-white font-bold text-lg rounded-lg hover:shadow-lg hover:shadow-cyan-500/50 transition-all duration-300 hover:scale-105"
        >
          <FontAwesomeIcon icon={faRocket} />
          Comienza tu Preparación Gratis
        </Link>
      </div>
    </section>
  );
};
