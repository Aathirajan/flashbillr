import React from 'react';
import { clsx } from 'clsx';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'sm' | 'md' | 'lg';
  hover?: boolean;
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  className, 
  padding = 'md', 
  hover = false 
}) => {
  return (
    <div className={clsx(
      'bg-white rounded-xl border border-gray-200 shadow-sm',
      hover && 'hover:shadow-md transition-shadow duration-200',
      padding === 'sm' && 'p-4',
      padding === 'md' && 'p-6',
      padding === 'lg' && 'p-8',
      className
    )}>
      {children}
    </div>
  );
};