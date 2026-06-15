import { cn } from '@/utils/cn';
import { Icon } from '@/shared/components/Icon';
import { useDonationContext } from './DonationContext';

export function DonationCopyMethod() {
  const { copied, copyToClipboard, currentMethod } = useDonationContext();
  if (currentMethod?.type !== 'copy') return null;

  return (
    <div className="animate-fade-in-up border-surface-border bg-surface-elevated/50 rounded-xl border p-4">
      <p className="text-on-surface-muted mb-2 text-xs uppercase">Número de cuenta / Billetera</p>
      <div className="mb-2 flex items-center gap-2">
        <code className="bg-surface-overlay/60 text-app-accent-muted flex-1 rounded-lg p-3 font-mono text-sm break-all">
          {currentMethod.detail}
        </code>
        <button
          onClick={() => currentMethod.detail && copyToClipboard(currentMethod.detail, currentMethod.id)}
          className="bg-app-accent-strong text-app-on-accent hover:bg-app-accent-darker rounded-lg p-3 transition-colors"
          title="Copiar"
          aria-label="Copiar número de cuenta"
        >
          <Icon name={copied === currentMethod.id ? 'check' : 'copy'} />
        </button>
      </div>
      {currentMethod.owner && (
        <p className="text-on-surface-muted text-xs">
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
    <div className="animate-fade-in-up border-surface-border bg-surface-elevated/50 rounded-xl border p-4 text-center">
      <p className="text-on-surface-muted mb-4 text-sm">
        Serás redirigido a la plataforma segura de {currentMethod.name} para completar la donación.
      </p>
      <a
        href={currentMethod.detail}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          'bg-app-accent-strong text-app-on-accent block w-full transform rounded-xl py-3 font-bold shadow-lg',
          'shadow-app-accent/25 hover:bg-app-accent-darker transition-all hover:scale-105'
        )}
      >
        Ir a Donar
      </a>
    </div>
  );
}
