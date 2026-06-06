export const Footer = () => {
  return (
    <footer className="w-full border-t border-surface-border bg-surface-elevated/80 px-4 py-8 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 text-sm text-on-surface-muted md:flex-row">
        <div className="flex items-center gap-2">
          <span>Contacto:</span>
          <a
            href="mailto:fravelz@proton.me"
            className="focus-visible:ring-app-accent text-blue-400 transition-colors hover:text-blue-300 focus-visible:rounded focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-surface focus-visible:outline-none"
          >
            fravelz@proton.me
          </a>
        </div>

        <div className="flex items-center gap-6">
          <a
            href="/privacidad"
            className="focus-visible:ring-app-accent rounded transition-colors hover:text-on-surface focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-surface focus-visible:outline-none"
          >
            Política de Privacidad
          </a>
          <a
            href="/terminos"
            className="focus-visible:ring-app-accent rounded transition-colors hover:text-on-surface focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-surface focus-visible:outline-none"
          >
            Términos y Condiciones
          </a>
        </div>

        <div className="text-xs text-on-surface-muted/70">© {new Date().getFullYear()} ICFES Master</div>
      </div>
    </footer>
  );
};
