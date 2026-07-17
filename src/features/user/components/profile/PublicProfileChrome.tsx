import Link from 'next/link';
import { Icon } from '@/shared/components/Icon';
import { cn } from '@/utils/cn';

const linkClass =
  'text-on-surface-muted hover:text-on-surface inline-flex items-center gap-2 text-sm font-medium transition-colors focus-visible:ring-app-accent focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none focus-visible:ring-offset-surface';

export function PublicProfileChrome() {
  return (
    <header
      className={cn(
        'border-surface-border bg-surface-elevated/70 mb-8 flex items-center',
        'justify-between rounded-2xl border px-4 py-3 backdrop-blur-md'
      )}
    >
      <Link href="/" className={linkClass}>
        <Icon name="rocket" className="text-app-accent" />
        <span className="text-on-surface font-semibold">ICFES Master</span>
      </Link>
      <nav className="flex items-center gap-3">
        <Link href="/" className={linkClass}>
          Inicio
        </Link>
        <Link
          href="/login"
          className={cn(
            'bg-app-accent inline-flex items-center rounded-lg px-3 py-1.5 ' +
              'text-sm font-semibold text-white transition-colors hover:brightness-110',
            'focus-visible:ring-app-accent focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
            'focus-visible:ring-offset-surface'
          )}
        >
          Entrar
        </Link>
      </nav>
    </header>
  );
}
