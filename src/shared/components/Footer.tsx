export const Footer = () => {
  return (
    <footer className="w-full border-t border-white/10 bg-black/50 px-4 py-8 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 text-sm text-gray-400 md:flex-row">
        <div className="flex items-center gap-2">
          <span>Contacto:</span>
          <a href="mailto:fravelz@proton.me" className="text-blue-400 transition-colors hover:text-blue-300">
            fravelz@proton.me
          </a>
        </div>

        <div className="flex items-center gap-6">
          <a href="/privacidad" className="transition-colors hover:text-white">
            Política de Privacidad
          </a>
          <a href="/terminos" className="transition-colors hover:text-white">
            Términos y Condiciones
          </a>
        </div>

        <div className="text-xs text-gray-600">© {new Date().getFullYear()} ICFES Master</div>
      </div>
    </footer>
  );
};
