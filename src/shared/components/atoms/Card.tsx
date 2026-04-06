import React from 'react';
import { cn } from '@/utils/cn';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

export const Card = ({ children, className = '', hover = false, onClick }: CardProps) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        'dark:bg-opacity-80 rounded-3xl border-2 border-gray-200 bg-white p-8 shadow-2xl',
        'dark:border-gray-700 dark:bg-slate-950 dark:shadow-2xl',
        hover && 'hover-lift hover-glow cursor-pointer transition-all duration-300',
        className
      )}
    >
      {children}
    </div>
  );
};
