import * as React from 'react';
import { cn } from '../../lib/cn';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', label, error, helperText, ...props }, ref) => {
    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label className="text-sm font-medium text-gray-300">
            {label}
          </label>
        )}
        <input
          type={type}
          ref={ref}
          className={cn(
            "glass-input w-full",
            error && "border-danger focus:border-danger focus:ring-danger/50 focus:ring-1",
            className
          )}
          {...props}
        />
        {error && (
          <span className="text-xs text-danger font-medium">{error}</span>
        )}
        {!error && helperText && (
          <span className="text-xs text-gray-500">{helperText}</span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
export default Input;
