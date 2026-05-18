'use client';

import { useGSAPReveal } from '@/hooks/useGSAPReveal';

interface AnimatedRevealProps extends React.HTMLAttributes<HTMLDivElement> {
  isVisible: boolean;
  delay?: number;
  duration?: number;
  y?: number;
}

/** Animates children when isVisible is true (e.g. hero on load) */
export const AnimatedReveal = ({
  isVisible,
  delay = 0,
  duration = 0.8,
  y = 40,
  children,
  className,
  style,
  ...props
}: AnimatedRevealProps) => {
  const ref = useGSAPReveal(isVisible, { delay, duration, y });

  const initialStyle: React.CSSProperties = {
    opacity: 0,
    transform: `translateY(${y}px)`,
    ...style,
  };

  return (
    <div ref={ref} className={className} style={initialStyle} {...props}>
      {children}
    </div>
  );
};
