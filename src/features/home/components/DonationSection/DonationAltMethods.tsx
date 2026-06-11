import { cn } from '@/utils/cn';
import { Icon } from '@/shared/components/Icon';
import { useDonationContext } from './DonationContext';

export function DonationCopyMethod() {
  const { copied, copyToClipboard, currentMethod } = useDonationContext();
  if (currentMethod?.type !== 'copy') return null;

  return (
    <div className="animate-fade-in-up rounded-xl border border-white/10 bg-white/5 p-4">
      <p className="mb-2 text-xs text-gray-500 uppercase">Número de cuenta / Billetera</p>
      <div className="mb-2 flex items-center gap-2">
        <code className="flex-1 rounded-lg bg-black/30 p-3 font-mono text-sm break-all text-purple-300">
          {currentMethod.detail}
        </code>
        <button
          onClick={() => currentMethod.detail && copyToClipboard(currentMethod.detail, currentMethod.id)}
          className="rounded-lg bg-purple-600 p-3 text-white transition-colors hover:bg-purple-700"
          title="Copiar"
        >
          <Icon name={copied === currentMethod.id ? 'check' : 'copy'} />
        </button>
      </div>
      {currentMethod.owner && (
        <p className="text-xs text-gray-400">
          Titular: <span className="text-gray-300">{currentMethod.owner}</span>
        </p>
      )}
    </div>
  );
}

export function DonationUrlMethod() {
  const { currentMethod } = useDonationContext();
  if (currentMethod?.type !== 'url') return null;

  return (
    <div className="animate-fade-in-up rounded-xl border border-white/10 bg-white/5 p-4 text-center">
      <p className="mb-4 text-sm text-gray-300">
        Serás redirigido a la plataforma segura de {currentMethod.name} para completar la donación.
      </p>
      <a
        href={currentMethod.detail}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          'block w-full transform rounded-xl bg-purple-600 py-3 font-bold text-white shadow-lg',
          'shadow-purple-500/25 transition-all hover:scale-105 hover:bg-purple-700'
        )}
      >
        Ir a Donar
      </a>
    </div>
  );
}
