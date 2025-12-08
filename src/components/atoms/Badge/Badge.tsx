import React from 'react';
import type { BadgeProps } from './Badge.types';

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'default' }) => {
  const variants: Record<NonNullable<BadgeProps['variant']>, string> = {
    default: 'bg-gray-200 text-gray-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-orange-100 text-orange-800',
    danger: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800',
  };

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${variants[variant]}`}>
      {children}
    </span>
  );
};