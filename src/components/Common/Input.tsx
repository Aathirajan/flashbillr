import React, { forwardRef } from 'react';
import { clsx } from 'clsx';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

/**
 * Text input with label & inline error – keeps styling consistent across app.
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(({ label, error, className, id, ...props }, ref) => {
  const inputId = id || props.name;
  return (
    <div className={clsx('w-full', className)}>
      <label htmlFor={inputId} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        id={inputId}
        ref={ref}
        {...props}
        className={clsx(
          'mt-1 block w-full rounded-md shadow-sm border p-2 text-sm',
          error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
        )}
      />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
