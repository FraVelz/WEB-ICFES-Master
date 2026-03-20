import { Icon } from '@/shared/components/Icon';

export const Footer = () => {
  return (
    <div className="mt-12 flex flex-col items-center justify-center gap-4 border-t border-white/10 pt-6 text-center text-xs text-gray-500 sm:flex-row">
      <div className="flex items-center gap-2">
        <Icon name="envelope" />
        <a
          href="mailto:fravelz@proton.me"
          className="transition-colors hover:text-purple-400"
        >
          fravelz@proton.me
        </a>
      </div>
      <span className="hidden sm:inline">|</span>
      <div className="flex gap-4">
        <a
          href="/privacidad"
          className="transition-colors hover:text-purple-400"
        >
          Privacidad
        </a>
        <a href="/terminos" className="transition-colors hover:text-purple-400">
          Términos
        </a>
      </div>
    </div>
  );
};
