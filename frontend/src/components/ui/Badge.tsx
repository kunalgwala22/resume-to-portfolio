import * as React from 'react';
import { cn } from '../../lib/cn';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'outline';
}

export const Badge: React.FC<BadgeProps> = ({ className, variant = 'primary', children, ...props }) => {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold select-none",
        variant === 'primary' && "bg-primary/10 text-primary border border-primary/20",
        variant === 'secondary' && "bg-secondary/10 text-secondary border border-secondary/20",
        variant === 'success' && "bg-success/10 text-success border border-success/20",
        variant === 'danger' && "bg-danger/10 text-danger border border-danger/20",
        variant === 'warning' && "bg-warning/10 text-warning border border-warning/20",
        variant === 'outline' && "bg-transparent text-gray-300 border border-border",
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};

export default Badge;
