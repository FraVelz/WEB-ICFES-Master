'use client';

import { useGSAPReveal } from '@/hooks/useGSAPReveal';

interface AnimatedRevealProps extends React.HTMLAttributes<HTMLDivElement> {
  isVisible: boolean;
  isInitialLoad: boolean;
  delay?: number;
  duration?: number;
  y?: number;
}

/**
 * Wrapper que anima su contenido con GSAP al hacerse visible o en carga inicial
 */
export const AnimatedReveal = ({
  isVisible,
  isInitialLoad,
  delay = 0,
  duration = 0.8,
  y = 40,
  children,
  className,
  ...props
}: AnimatedRevealProps) => {
  const ref = useGSAPReveal(isVisible, isInitialLoad, { delay, duration, y });

  return (
    <div ref={ref} className={className} {...props}>
      {children}
    </div>
  );
};
