/**
 * Configuración central de GSAP
 * Registra plugins y define easings/duraciones por defecto
 */
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const GSAP_DURATION = 0.6;
const GSAP_EASE = 'power2.out';

function isReducedMotionEnvironment(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

const reducedMotion = isReducedMotionEnvironment();

if (reducedMotion) {
  gsap.defaults({ duration: 0, ease: 'none' });
  gsap.globalTimeline.pause();
  ScrollTrigger.getAll().forEach((trigger) => trigger.disable());
}

if (typeof window !== 'undefined') {
  const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  motionQuery.addEventListener('change', (event) => {
    if (event.matches) {
      gsap.defaults({ duration: 0, ease: 'none' });
      gsap.globalTimeline.pause();
      ScrollTrigger.getAll().forEach((trigger) => trigger.disable());
      return;
    }

    gsap.defaults({ duration: GSAP_DURATION, ease: GSAP_EASE });
    gsap.globalTimeline.play();
    ScrollTrigger.getAll().forEach((trigger) => trigger.enable());
  });
}

export { gsap, ScrollTrigger };

const GSAP_DEFAULTS = {
  duration: reducedMotion ? 0 : GSAP_DURATION,
  ease: reducedMotion ? 'none' : GSAP_EASE,
  stagger: reducedMotion ? 0 : 0.1,
} as const;
