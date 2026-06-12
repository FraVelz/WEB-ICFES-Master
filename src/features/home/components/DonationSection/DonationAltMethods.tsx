import { cn } from '@/utils/cn';
import { Icon } from '@/shared/components/Icon';
import { useDonationContext } from './DonationContext';

export function DonationCopyMethod() {
  const { copied, copyToClipboard, currentMethod } = useDonationContext();
  if (currentMethod?.type !== 'copy') return null;

  return (
    <div className="animate-fade-in-up rounded-xl border border-surface-border bg-surface-elevated/50 p-4">
      <p className="mb-2 text-xs text-on-surface-muted uppercase">Número de cuenta / Billetera</p>
      <div className="mb-2 flex items-center gap-2">
        <code className="flex-1 rounded-lg bg-surface-overlay/60 p-3 font-mono text-sm break-all text-app-accent-muted">
          {currentMethod.detail}
        </code>
        <button
          onClick={() => currentMethod.detail && copyToClipboard(currentMethod.detail, currentMethod.id)}
          className="rounded-lg bg-app-accent-strong p-3 text-app-on-accent transition-colors hover:bg-app-accent-darker"
          title="Copiar"
        >
          <Icon name={copied === currentMethod.id ? 'check' : 'copy'} />
        </button>
      </div>
      {currentMethod.owner && (
        <p className="text-xs text-on-surface-muted">
          Titular: <span className="text-on-surface">{currentMethod.owner}</span>
        </p>
      )}
    </div>
  );
}

export function DonationUrlMethod() {
  const { currentMethod } = useDonationContext();
  if (currentMethod?.type !== 'url') return null;

  return (
    <div className="animate-fade-in-up rounded-xl border border-surface-border bg-surface-elevated/50 p-4 text-center">
      <p className="mb-4 text-sm text-on-surface-muted">
        Serás redirigido a la plataforma segura de {currentMethod.name} para completar la donación.
      </p>
      <a
        href={currentMethod.detail}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          'block w-full transform rounded-xl bg-app-accent-strong py-3 font-bold text-app-on-accent shadow-lg',
          'shadow-app-accent/25 transition-all hover:scale-105 hover:bg-app-accent-darker'
        )}
      >
        Ir a Donar
      </a>
    </div>
  );
}
