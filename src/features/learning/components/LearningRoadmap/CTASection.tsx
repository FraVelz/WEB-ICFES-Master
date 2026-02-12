import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFire } from '@fortawesome/free-solid-svg-icons';
import { MascotaCircle } from '@/shared/components/MascotaCircle';

/**
 * Componente de Call to Action al final del mapa
 */
export const CTASection = () => {
  return (
    <div className="mb-20 bg-linear-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-center">
      <FontAwesomeIcon icon={faFire} className="text-yellow-300 text-4xl mb-4" />
      <h3 className="text-2xl font-bold text-white mb-2">¿Listo para tu preparación ICFES?</h3>
      <p className="text-blue-100 mb-6">
        Sigue los tres niveles de forma ordenada: Básico, Intermedio, Avanzado. Asi de simple, gana recompensas,
        compite, y diviertete mientras aprendes.
      </p>

      <div>
        <MascotaCircle
          src="/avatars/celebrando.webp"
          alt="Mascota feliz"
          size="xlarge"
          centered
          className="mb-4"
        />
      </div>
    </div>
  );
};
