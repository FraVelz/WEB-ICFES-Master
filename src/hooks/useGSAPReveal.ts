/**
 * Hook para animaciones de revelado con GSAP
 * Reemplaza getAnimationStyle para animaciones al hacer scroll o en carga inicial
 */
import { useRef, useEffect } from 'react';
import { gsap } from '@/lib/gsap';

interface UseGSAPRevealOptions {
  delay?: number;
  duration?: number;
  y?: number;
  ease?: string;
}

export const useGSAPReveal = (
  isVisible: boolean,
  isInitialLoad: boolean,
  options: UseGSAPRevealOptions = {}
) => {
  const ref = useRef<HTMLDivElement>(null);
  const { delay = 0, duration = 0.8, y = 40, ease = 'power2.out' } = options;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const shouldAnimate = isVisible || isInitialLoad;

    if (shouldAnimate) {
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
  }, [isVisible, isInitialLoad, delay, duration, y, ease]);

  return ref;
};
