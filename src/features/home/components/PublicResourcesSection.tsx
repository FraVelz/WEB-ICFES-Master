import Link from 'next/link';
import { PUBLIC_CONTENT_PAGES } from '@/config/publicContentPages';

const linkClass =
  'border-surface-border bg-surface-elevated/60 hover:border-app-ring/40 hover:bg-surface-elevated block rounded-xl border p-4 transition-colors focus-visible:ring-app-accent focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none';

export function PublicResourcesSection() {
  return (
    <section aria-labelledby="public-resources-heading" className="mx-auto max-w-5xl px-4">
      <h2 id="public-resources-heading" className="text-on-surface mb-2 text-center text-2xl font-bold">
        Recursos gratuitos sobre el ICFES
      </h2>
      <p className="text-on-surface-muted mx-auto mb-8 max-w-2xl text-center text-sm leading-relaxed">
        Guías de lectura, consejos de estudio e información oficial del Saber 11° — sin necesidad de cuenta.
      </p>
      <ul className="grid gap-4 sm:grid-cols-2">
        {PUBLIC_CONTENT_PAGES.map((page) => (
          <li key={page.href}>
            <Link href={page.href} className={linkClass}>
              <span className="text-on-surface block font-semibold">{page.label}</span>
              <span className="text-on-surface-muted mt-1 block text-sm leading-relaxed">{page.description}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
