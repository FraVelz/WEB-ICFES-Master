import { Icon } from '@/shared/components/Icon';

export const Header = () => {
  return (
    <div className="mb-10 text-center">
      <div className="mb-4 inline-flex items-center justify-center rounded-full bg-purple-500/20 p-3">
        <Icon name="heart" className="animate-pulse text-xl text-purple-400" />
      </div>
      <h3 className="mb-3 text-3xl font-bold text-white">
        Apoya este Proyecto
      </h3>
      <p className="mx-auto max-w-2xl leading-relaxed text-gray-300">
        Esta plataforma es completamente gratuita y se mantiene gracias al
        esfuerzo personal.
        <span className="mt-2 block font-medium text-purple-300">
          Incluso una donación pequeña (como 2.000 COP) ayuda a mantener los
          servidores y seguir mejorando.
        </span>
      </p>
    </div>
  );
};
