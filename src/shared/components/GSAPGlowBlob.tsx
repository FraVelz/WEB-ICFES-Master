'use client';

import { useRef, useEffect } from 'react';
import { gsap } from '@/lib/gsap';

interface GSAPGlowBlobProps {
  className?: string;
  delay?: number;
}

/**
 * Blob decorativo con animación de pulso suave usando GSAP
 */
export const GSAPGlowBlob = ({ className = '', delay = 0 }: GSAPGlowBlobProps) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const tl = gsap.timeline({ repeat: -1, delay });
    tl.to(el, { opacity: 0.5, duration: 2, ease: 'sine.inOut' });
    tl.to(el, { opacity: 0.3, duration: 2, ease: 'sine.inOut' });

    return () => tl.kill();
  }, [delay]);

  return (
    <div
      ref={ref}
      className={className}
      aria-hidden="true"
      style={{ filter: 'blur(90px)', willChange: 'opacity' }}
    />
  );
};
