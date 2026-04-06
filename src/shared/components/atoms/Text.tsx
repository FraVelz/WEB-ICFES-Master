import React from 'react';
import { cn } from '@/utils/cn';

type TextVariant = 'default' | 'small' | 'large' | 'muted' | 'bold';

interface TextProps {
  children: React.ReactNode;
  as?: keyof React.JSX.IntrinsicElements;
  variant?: TextVariant;
  className?: string;
}

export const Text = ({ children, as: As = 'p', variant = 'default', className = '' }: TextProps) => {
  const Component = As as React.ElementType;

  const variants: Record<TextVariant, string> = {
    default: 'text-white text-base md:text-base',
    small: 'text-gray-300 text-sm md:text-sm',
    large: 'text-white text-lg md:text-xl',
    muted: 'text-gray-400 text-base',
    bold: 'text-white font-bold text-base md:text-lg',
  };

  return <Component className={cn(variants[variant], className)}>{children}</Component>;
};

interface TitleProps {
  children: React.ReactNode;
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  className?: string;
}

export const Title = ({ children, level = 1, className = '' }: TitleProps) => {
  const sizes = {
    1: 'text-3xl md:text-5xl lg:text-6xl',
    2: 'text-2xl md:text-3xl lg:text-4xl',
    3: 'text-xl md:text-2xl',
    4: 'text-lg md:text-xl',
    5: 'text-base md:text-lg',
    6: 'text-sm md:text-base',
  };

  const l = level in sizes ? level : 1;
  return <h1 className={cn('font-bold text-white', sizes[l as keyof typeof sizes], className)}>{children}</h1>;
};
