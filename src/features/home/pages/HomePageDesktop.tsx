'use client';

import { useGSAP } from '@gsap/react';
import dynamic from 'next/dynamic';
import { memo, useRef } from 'react';
import { cn } from '@/utils/cn';

import { gsap } from '@/lib/gsap';

import { Footer } from '@/features/home/components/Footer';
import { GSAPGlowBlob } from '@/features/home/components/GSAPGlowBlob';

import { HeroSection } from '@/features/home/components/HeroSection';

import { PUBLIC_PAGE_SHELL_CLASS } from '@/shared/constants/pageShell';

import homeStyles from './HomePageDesktop.module.css';

const sectionFallback = (
  <div className="bg-surface-border/40 mx-auto min-h-48 max-w-6xl animate-pulse rounded-2xl motion-reduce:animate-none" />
);

const AreasSection = dynamic(
  () => import('@/features/home/components/AreasSection').then((mod) => ({ default: mod.AreasSection })),
  { loading: () => sectionFallback }
);

const RouteTo500TeaserSection = dynamic(
  () =>
    import('@/features/home/components/RouteTo500TeaserSection').then((mod) => ({
      default: mod.RouteTo500TeaserSection,
    })),
  { loading: () => sectionFallback }
);

const PublicResourcesSection = dynamic(
  () =>
    import('@/features/home/components/PublicResourcesSection').then((mod) => ({
      default: mod.PublicResourcesSection,
    })),
  { loading: () => sectionFallback }
);

const FAQSection = dynamic(
  () => import('@/features/home/components/FAQSection').then((mod) => ({ default: mod.FAQSection })),
  { loading: () => sectionFallback }
);

const GLOW_EFFECTS = [
  {
    position: 'top-1/3 left-1/4',
    size: 'w-96 h-96',
    color: 'bg-ambient-a/15 dark:bg-ambient-a/30',
    delay: 0,
  },
  {
    position: 'bottom-1/3 right-1/4',
    size: 'w-96 h-96',
    color: 'bg-ambient-b/12 dark:bg-ambient-b/30',
    delay: 1,
  },
  {
    position: 'top-2/3 left-3/4',
    size: 'w-72 h-72',
    color: 'bg-ambient-c/8 dark:bg-ambient-c/20',
    delay: 0.5,
  },
];

const HomePageDesktopComponent = () => {
  const scrollLayerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = scrollLayerRef.current;
      if (!root) return;

      const reduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const nodes = gsap.utils.toArray<HTMLElement>(root.querySelectorAll('[data-home-reveal]'));

      if (reduced) {
        gsap.set(nodes, { clearProps: 'opacity,transform,willChange' });
        return;
      }

      nodes.forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 80, scale: 0.9 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.55,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 88%',
              once: true,
              invalidateOnRefresh: true,
            },
            onComplete: () => {
              gsap.set(el, { clearProps: 'willChange' });
            },
          }
        );
      });
    },
    { scope: scrollLayerRef }
  );

  const scrollToTopAndFocusHero = () => {
    const el = document.getElementById('top');
    if (!el) return;
    const reduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
    window.setTimeout(
      () => {
        el.focus({ preventScroll: true });
      },
      reduced ? 0 : 380
    );
  };

  return (
    <div className={cn('overflow-x-hidden', PUBLIC_PAGE_SHELL_CLASS)}>
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden lg:px-20" role="presentation">
        <div className="to-surface/40 absolute inset-0 bg-linear-to-b from-transparent via-transparent" />
        {GLOW_EFFECTS.map((effect, index) => (
          <GSAPGlowBlob
            key={`glow-${index}`}
            className={cn('absolute rounded-full blur-3xl', effect.position, effect.size, effect.color)}
            delay={effect.delay}
          />
        ))}
        <div className="radial-gradient pointer-events-none absolute inset-0" />
      </div>

      <div ref={scrollLayerRef} className="relative z-10 w-full">
        <section tabIndex={-1} id="top" className="relative overflow-hidden py-0">
          <div data-home-reveal className={homeStyles.revealScroll}>
            <HeroSection />
          </div>
        </section>

        <section className="relative overflow-hidden py-8 md:py-12">
          <div
            className={cn(
              'absolute top-0 right-0 left-0 h-1 bg-linear-to-r',
              'from-transparent via-blue-500/50 to-transparent'
            )}
          />
          <div data-home-reveal className={homeStyles.revealScroll}>
            <AreasSection />
          </div>
        </section>

        <section className="relative overflow-hidden py-12 md:py-16">
          <div data-home-reveal className={homeStyles.revealScroll}>
            <RouteTo500TeaserSection />
          </div>
        </section>

        <section className="relative overflow-hidden py-12 md:py-16">
          <div data-home-reveal className={homeStyles.revealScroll}>
            <PublicResourcesSection />
          </div>
        </section>

        <section className="relative overflow-hidden py-12 md:py-16">
          <div data-home-reveal className={homeStyles.revealScroll}>
            <FAQSection />
          </div>
        </section>

        <nav aria-label="Navegación al inicio de la página" className="relative">
          <button type="button" className="skip-link" onClick={scrollToTopAndFocusHero}>
            Volver arriba
          </button>
        </nav>

        <Footer />
      </div>
    </div>
  );
};

export const HomePageDesktop = memo(HomePageDesktopComponent);
