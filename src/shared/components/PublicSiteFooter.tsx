import Link from 'next/link';
import { PUBLIC_CONTENT_PAGES, PUBLIC_LEGAL_PAGES } from '@/config/publicContentPages';
import { cn } from '@/utils/cn';

const footerLinkClass = cn(
  'hover:text-on-surface rounded transition-colors',
  'focus-visible:ring-app-accent focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
  'focus-visible:ring-offset-surface'
);

type PublicSiteFooterProps = {
  className?: string;
};

export function PublicSiteFooter({ className }: PublicSiteFooterProps) {
  return (
    <footer
      className={cn(
        'border-surface-border bg-surface-elevated/80 w-full border-t px-4 py-8 backdrop-blur-sm',
        className
      )}
    >
      <div className="mx-auto max-w-7xl space-y-6">
        <nav
          aria-label="Recursos sobre el ICFES"
          className="text-on-surface-muted flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm"
        >
          {PUBLIC_CONTENT_PAGES.map((page) => (
            <Link key={page.href} href={page.href} className={footerLinkClass}>
              {page.label}
            </Link>
          ))}
        </nav>

        <div
          className={cn(
            'text-on-surface-muted mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 text-sm',
            'md:flex-row'
          )}
        >
          <div className="flex items-center gap-2">
            <span>Contacto:</span>
            <a
              href="mailto:fravelz@proton.me"
              className={cn('text-app-accent hover:text-app-accent-muted', footerLinkClass)}
            >
              fravelz@proton.me
            </a>
          </div>

          <nav aria-label="Legal" className="flex items-center gap-6">
            {PUBLIC_LEGAL_PAGES.map((page) => (
              <Link key={page.href} href={page.href} className={footerLinkClass}>
                {page.label}
              </Link>
            ))}
          </nav>

          <div className="text-on-surface-muted/70 text-xs">© {new Date().getFullYear()} ICFES Master</div>
        </div>
      </div>
    </footer>
  );
}
