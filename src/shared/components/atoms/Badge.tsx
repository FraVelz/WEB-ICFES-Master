import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'math' | 'language' | 'science' | 'social';
  className?: string;
}

export const Badge = ({ children, variant = 'default', className = '' }: BadgeProps) => {
  const variants: Record<string, string> = {
    default:
      'bg-linear-to-r from-blue-100 to-blue-200 text-blue-900 border border-blue-300',
    success:
      'bg-linear-to-r from-green-100 to-emerald-200 text-green-900 border border-green-300',
    warning:
      'bg-linear-to-r from-yellow-100 to-amber-200 text-yellow-900 border border-yellow-300',
    danger:
      'bg-linear-to-r from-red-100 to-orange-200 text-red-900 border border-red-300',
    math: 'bg-linear-to-r from-purple-100 to-purple-200 text-purple-900 border border-purple-300',
    language:
      'bg-linear-to-r from-pink-100 to-pink-200 text-pink-900 border border-pink-300',
    science:
      'bg-linear-to-r from-green-100 to-teal-200 text-green-900 border border-green-300',
    social:
      'bg-linear-to-r from-blue-100 to-indigo-200 text-blue-900 border border-blue-300',
  };

  return (
    <span
      className={`inline-block rounded-full px-4 py-2 text-sm font-bold ${variants[variant] ?? variants.default} ${className} shadow-sm`}
    >
      {children}
    </span>
  );
};
