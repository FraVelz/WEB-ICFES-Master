'use client';

import { useRef, useEffect } from 'react';
import { gsap } from '@/lib/gsap';
import { prefersReducedMotion } from '@/utils/prefersReducedMotion';

interface AnimatedOnMountProps extends React.HTMLAttributes<HTMLDivElement> {
  delay?: number;
  duration?: number;
  y?: number;
}

/** Entrance animation when the component mounts */
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

    if (prefersReducedMotion()) {
      gsap.set(el, { opacity: 1, y: 0 });
      return;
    }

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
