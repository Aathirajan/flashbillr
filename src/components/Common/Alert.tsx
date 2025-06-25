import React from 'react';
import { clsx } from 'clsx';

interface AlertProps {
  variant?: 'success' | 'error' | 'info' | 'warning';
  children: React.ReactNode;
  className?: string;
}

const variantStyles = {
  success: {
    bg: 'bg-green-50',
    border: 'border-green-400',
    iconColor: 'text-green-400',
  },
  error: {
    bg: 'bg-red-50',
    border: 'border-red-400',
    iconColor: 'text-red-400',
  },
  info: {
    bg: 'bg-blue-50',
    border: 'border-blue-400',
    iconColor: 'text-blue-400',
  },
  warning: {
    bg: 'bg-yellow-50',
    border: 'border-yellow-400',
    iconColor: 'text-yellow-400',
  },
} as const;

export const Alert: React.FC<AlertProps> = ({ variant = 'info', children, className }) => {
  const style = variantStyles[variant];
  return (
    <div className={clsx('rounded-md p-4', style.bg, style.border, className)}>
      <div className="flex">
        <div className="flex-shrink-0">
          {/* simple circle icon */}
          <svg className={clsx('h-5 w-5', style.iconColor)} viewBox="0 0 20 20" fill="currentColor">
            <circle cx="10" cy="10" r="8" />
          </svg>
        </div>
        <div className="ml-3 text-sm text-gray-800">{children}</div>
      </div>
    </div>
  );
};

export default Alert;
