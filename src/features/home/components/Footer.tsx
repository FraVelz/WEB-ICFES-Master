export const Footer = () => {
  return (
    <footer className="border-surface-border bg-surface-elevated/80 w-full border-t px-4 py-8 backdrop-blur-sm">
      <div className="text-on-surface-muted mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 text-sm md:flex-row">
        <div className="flex items-center gap-2">
          <span>Contacto:</span>
          <a
            href="mailto:fravelz@proton.me"
            className="focus-visible:ring-app-accent focus-visible:ring-offset-surface text-blue-400 transition-colors hover:text-blue-300 focus-visible:rounded focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
          >
            fravelz@proton.me
          </a>
        </div>

        <div className="flex items-center gap-6">
          <a
            href="/privacidad"
            className="focus-visible:ring-app-accent hover:text-on-surface focus-visible:ring-offset-surface rounded transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
          >
            Política de Privacidad
          </a>
          <a
            href="/terminos"
            className="focus-visible:ring-app-accent hover:text-on-surface focus-visible:ring-offset-surface rounded transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
          >
            Términos y Condiciones
          </a>
        </div>

        <div className="text-on-surface-muted/70 text-xs">© {new Date().getFullYear()} ICFES Master</div>
      </div>
    </footer>
  );
};
