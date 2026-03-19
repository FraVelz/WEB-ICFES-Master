'use client';

import { useRef, useEffect } from 'react';
import { gsap } from '@/lib/gsap';

interface AnimatedOnMountProps extends React.HTMLAttributes<HTMLDivElement> {
  delay?: number;
  duration?: number;
  y?: number;
}

/**
 * Animación de entrada al montar el componente
 */
export const AnimatedOnMount = ({
  delay = 0,
  duration = 0.7,
  y = 16,
  children,
  className,
  ...props
}: AnimatedOnMountProps) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    gsap.fromTo(
      el,
      { opacity: 0, y },
      {
        opacity: 1,
        y: 0,
        duration,
        delay,
        ease: 'power2.out',
      }
    );
  }, [delay, duration, y]);

  return (
    <div ref={ref} className={className} {...props}>
      {children}
    </div>
  );
};
