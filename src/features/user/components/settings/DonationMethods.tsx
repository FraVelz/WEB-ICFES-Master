'use client';

import { useState } from 'react';
import { cn } from '@/utils/cn';
import { Icon } from '@/shared/components/Icon';
import {
  DONATION_BRE_B_HOLDER,
  DONATION_BRE_B_KEY,
  DONATION_PAYPAL_HOLDER,
  DONATION_PAYPAL_URL,
} from './donationConstants';

async function copyText(value: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(value);
    return true;
  } catch {
    return false;
  }
}

export function DonationMethods() {
  const [copiedKey, setCopiedKey] = useState(false);

  const handleCopyBreB = async () => {
    const ok = await copyText(DONATION_BRE_B_KEY);
    if (!ok) return;
    setCopiedKey(true);
    window.setTimeout(() => setCopiedKey(false), 2000);
  };

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div className="border-surface-border bg-surface/50 rounded-xl border p-4">
        <h3 className="text-on-surface mb-1 flex items-center gap-2 font-bold">
          <Icon name="device-phone-mobile" className="text-app-accent" />
          Colombia — Llave Bre-B
        </h3>
        <p className="text-on-surface-muted mb-1 text-xs leading-relaxed">
          Transfiere desde Nequi, Bancolombia, Daviplata u otras entidades con llaves Bre-B.
        </p>
        <p className="text-on-surface-muted mb-4 text-xs">
          Titular: <span className="text-on-surface font-medium">{DONATION_BRE_B_HOLDER}</span>
        </p>
        <div
          className={cn(
            'border-surface-border bg-surface-elevated flex items-center gap-2 rounded-lg',
            'border px-3 py-2.5'
          )}
        >
          <span className="text-on-surface flex-1 font-mono text-sm font-semibold tracking-wide">
            {DONATION_BRE_B_KEY}
          </span>
          <button
            type="button"
            onClick={handleCopyBreB}
            className={cn(
              'inline-flex cursor-pointer items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold',
              'transition-colors',
              'focus-visible:ring-app-accent focus-visible:ring-2 focus-visible:outline-none',
              copiedKey
                ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400'
                : 'bg-app-ring/10 text-app-accent-strong hover:bg-app-ring/20 dark:text-app-accent'
            )}
          >
            <Icon name={copiedKey ? 'check' : 'copy'} size="sm" />
            {copiedKey ? 'Copiada' : 'Copiar'}
          </button>
        </div>
      </div>

      <div className="border-surface-border bg-surface/50 rounded-xl border p-4">
        <h3 className="text-on-surface mb-1 flex items-center gap-2 font-bold">
          <Icon name="paypal" className="text-app-accent" />
          Internacional — PayPal
        </h3>
        <p className="text-on-surface-muted mb-1 text-xs leading-relaxed">
          Donación desde cualquier país con tarjeta o saldo PayPal.
        </p>
        <p className="text-on-surface-muted mb-4 text-xs">
          Titular: <span className="text-on-surface font-medium">{DONATION_PAYPAL_HOLDER}</span>
        </p>
        <a
          href={DONATION_PAYPAL_URL}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            'inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg px-4 py-2.5',
            'from-app-accent-strong bg-linear-to-r to-blue-600 text-sm font-semibold text-white',
            'shadow-app-ring/20 shadow-md transition-opacity hover:opacity-90',
            'focus-visible:ring-app-accent focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
            'focus-visible:ring-offset-surface'
          )}
        >
          <Icon name="paypal" />
          paypal.me/fravelz
          <Icon name="chevron-right" size="sm" />
        </a>
      </div>
    </div>
  );
}
