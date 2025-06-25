import React, { forwardRef } from 'react';
import { clsx } from 'clsx';

interface Option {
  label: string;
  value: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: Option[];
  error?: string;
}

/**
 * Consistent select component with label & error.
 */
export const Select = forwardRef<HTMLSelectElement, SelectProps>(({ label, options, error, className, id, ...props }, ref) => {
  const selectId = id || props.name;
  return (
    <div className={clsx('w-full', className)}>
      <label htmlFor={selectId} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <select
        id={selectId}
        ref={ref}
        {...props}
        className={clsx(
          'mt-1 block w-full rounded-md border p-2 text-sm bg-white',
          error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
        )}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
});

Select.displayName = 'Select';

export default Select;
