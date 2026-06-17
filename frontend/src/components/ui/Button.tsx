import * as React from 'react';
import { cn } from '../../lib/cn';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, leftIcon, rightIcon, fullWidth, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        aria-busy={isLoading}
        className={cn(
          "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]",
          // Color presets
          variant === 'primary' && "bg-primary text-white hover:bg-primary/95 shadow-md shadow-primary/10 border border-primary/20",
          variant === 'secondary' && "bg-secondary text-white hover:bg-secondary/95 shadow-md shadow-secondary/10 border border-secondary/20",
          variant === 'ghost' && "bg-transparent text-gray-300 hover:text-white hover:bg-surface/50",
          variant === 'danger' && "bg-danger text-white hover:bg-danger/95 shadow-md shadow-danger/10 border border-danger/20",
          variant === 'outline' && "bg-transparent text-gray-300 border border-border hover:border-white hover:text-white",
          // Sizing presets
          size === 'sm' && "px-3 py-1.5 text-xs",
          size === 'md' && "px-4 py-2 text-sm",
          size === 'lg' && "px-6 py-3 text-base",
          fullWidth && "w-full",
          className
        )}
        {...props}
      >
        {isLoading && (
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        )}
        {!isLoading && leftIcon && <span className="mr-2 inline-flex">{leftIcon}</span>}
        {children}
        {!isLoading && rightIcon && <span className="ml-2 inline-flex">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';
export default Button;
