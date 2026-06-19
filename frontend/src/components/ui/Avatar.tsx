import * as React from 'react';
import { cn } from '../../lib/cn';

interface AvatarProps {
  src?: string | null;
  alt: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({ src, alt, size = 'md', className }) => {
  const [error, setError] = React.useState(false);

  const initials = alt
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div
      className={cn(
        "relative rounded-full flex items-center justify-center overflow-hidden bg-border border border-border select-none flex-shrink-0",
        size === 'sm' && "h-8 w-8 text-xs",
        size === 'md' && "h-10 w-10 text-sm",
        size === 'lg' && "h-16 w-16 text-xl font-bold",
        size === 'xl' && "h-24 w-24 text-3xl font-bold",
        className
      )}
    >
      {src && !error ? (
        <img
          src={src}
          alt={alt}
          onError={() => setError(true)}
          className="h-full w-full object-cover"
        />
      ) : (
        <span className="text-gray-400 font-display font-semibold">{initials}</span>
      )}
    </div>
  );
};

export default Avatar;
