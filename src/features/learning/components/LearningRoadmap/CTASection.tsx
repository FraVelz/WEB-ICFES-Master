import { Icon } from '@/shared/components/Icon';
import { MascotaCircle } from '@/shared/components/MascotaCircle';

/**
 * Componente de Call to Action al final del mapa
 */
export const CTASection = () => {
  return (
    <div className="mb-20 rounded-2xl bg-linear-to-r from-blue-600 to-purple-600 p-8 text-center">
      <Icon name="fire" className="mb-4 text-4xl text-yellow-300" />
      <h3 className="mb-2 text-2xl font-bold text-white">
        ¿Listo para tu preparación ICFES?
      </h3>
      <p className="mb-6 text-blue-100">
        Sigue los tres niveles de forma ordenada: Básico, Intermedio, Avanzado.
        Asi de simple, gana recompensas, compite, y diviertete mientras
        aprendes.
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
