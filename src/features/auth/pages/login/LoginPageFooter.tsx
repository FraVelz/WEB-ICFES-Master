'use client';

export function LoginPageFooter() {
  return (
    <div className="border-surface-border/50 relative z-10 mt-auto w-full border-t py-4">
      <div className="mx-auto max-w-md">
        <p className="text-on-surface-muted mb-3 text-center text-xs">
          Al registrarte, aceptas nuestros términos de servicio
        </p>
        <div className="flex items-center justify-center gap-4 text-xs">
          <a href="/privacidad" className="text-on-surface-muted hover:text-on-surface transition-colors">
            Política de Privacidad
          </a>
          <span className="text-surface-border">|</span>
          <a href="/terminos" className="text-on-surface-muted hover:text-on-surface transition-colors">
            Términos y Condiciones
          </a>
        </div>
      </div>
    </div>
  );
}
