import * as React from 'react';
import { cn } from '../../lib/cn';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { label: string; value: string | number }[];
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, options, ...props }, ref) => {
    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label className="text-sm font-medium text-gray-300">
            {label}
          </label>
        )}
        <select
          ref={ref}
          className={cn(
            "glass-input w-full bg-[#111827] cursor-pointer",
            error && "border-danger focus:border-danger focus:ring-danger/50 focus:ring-1",
            className
          )}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-dark text-white">
              {opt.label}
            </option>
          ))}
        </select>
        {error && (
          <span className="text-xs text-danger font-medium">{error}</span>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';
export default Select;
