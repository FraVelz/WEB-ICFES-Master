/**
 * Configuración central de GSAP
 * Registra plugins y define easings/duraciones por defecto
 */
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export { gsap, ScrollTrigger };

export const GSAP_DEFAULTS = {
  duration: 0.6,
  ease: 'power2.out',
  stagger: 0.1,
} as const;
