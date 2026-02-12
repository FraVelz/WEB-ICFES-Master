export const Footer = () => {
  return (
    <footer className="w-full py-8 px-4 bg-black/50 backdrop-blur-sm border-t border-white/10">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-400">
        <div className="flex items-center gap-2">
          <span>Contacto:</span>
          <a 
            href="mailto:fravelz@proton.me" 
            className="text-blue-400 hover:text-blue-300 transition-colors"
          >
            fravelz@proton.me
          </a>
        </div>
        
        <div className="flex items-center gap-6">
          <a href="/privacidad" className="hover:text-white transition-colors">Política de Privacidad</a>
          <a href="/terminos" className="hover:text-white transition-colors">Términos y Condiciones</a>
        </div>
        
        <div className="text-xs text-gray-600">
          © {new Date().getFullYear()} ICFES Master
        </div>
      </div>
    </footer>
  );
};
