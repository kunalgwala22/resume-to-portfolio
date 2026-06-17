import * as React from 'react';
import { cn } from '../../lib/cn';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, helperText, ...props }, ref) => {
    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label className="text-sm font-medium text-gray-300">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          className={cn(
            "glass-input w-full min-h-[100px] resize-y",
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

Textarea.displayName = 'Textarea';
export default Textarea;
