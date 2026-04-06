/** GSAP entrance presets for modals */
import { useRef, useEffect } from 'react';
import { gsap } from '@/lib/gsap';

type ModalEntranceType = 'fade' | 'slideUp' | 'slideDown' | 'slideFromTop';

interface UseGSAPModalEntranceOptions {
  isOpen: boolean;
  type?: ModalEntranceType;
  duration?: number;
}

const PRESETS: Record<ModalEntranceType, { from: gsap.TweenVars; to: gsap.TweenVars }> = {
  fade: {
    from: { opacity: 0 },
    to: { opacity: 1, duration: 0.2 },
  },
  slideUp: {
    from: { opacity: 0, y: '100%' },
    to: { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' },
  },
  slideDown: {
    from: { opacity: 0, y: -20 },
    to: { opacity: 1, y: 0, duration: 0.2, ease: 'power2.out' },
  },
  slideFromTop: {
    from: { opacity: 0, y: -10 },
    to: { opacity: 1, y: 0, duration: 0.2, ease: 'power2.out' },
  },
};

export const useGSAPModalEntrance = ({ isOpen, type = 'fade', duration }: UseGSAPModalEntranceOptions) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !isOpen) return;

    const preset = PRESETS[type];
    const toVars = { ...preset.to, duration: duration ?? preset.to.duration };

    gsap.fromTo(el, preset.from, toVars);
  }, [isOpen, type, duration]);

  return ref;
};
