/**
 * Hook para animaciones de revelado con GSAP cuando el elemento es visible (p. ej. IntersectionObserver)
 */
import { useRef, useEffect } from 'react';
import { gsap } from '@/lib/gsap';

interface UseGSAPRevealOptions {
  delay?: number;
  duration?: number;
  y?: number;
  ease?: string;
}

export const useGSAPReveal = (isVisible: boolean, options: UseGSAPRevealOptions = {}) => {
  const ref = useRef<HTMLDivElement>(null);
  const { delay = 0, duration = 0.8, y = 40, ease = 'power2.out' } = options;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (isVisible) {
      gsap.fromTo(
        el,
        { opacity: 0, y },
        {
          opacity: 1,
          y: 0,
          duration,
          delay,
          ease,
          overwrite: 'auto',
        }
      );
    } else {
      gsap.set(el, { opacity: 0, y });
    }
  }, [isVisible, delay, duration, y, ease]);

  return ref;
};
