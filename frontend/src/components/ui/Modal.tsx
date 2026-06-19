import * as React from 'react';
import { X } from 'lucide-react';
import { Button } from './Button';
import { cn } from '../../lib/cn';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, size = 'md' }) => {
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop overlay */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog container */}
      <div
        className={cn(
          "relative w-full max-h-[90vh] flex flex-col bg-surface border border-border/80 rounded-xl shadow-2xl overflow-hidden animate-slideUp z-10",
          size === 'sm' && "max-w-md",
          size === 'md' && "max-w-lg",
          size === 'lg' && "max-w-2xl",
          size === 'xl' && "max-w-4xl"
        )}
        role="dialog"
        aria-modal="true"
      >
        {/* Header bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border/60">
          <h3 className="text-lg font-bold text-white font-display">{title}</h3>
          <Button variant="ghost" size="sm" onClick={onClose} className="p-1 min-w-0" aria-label="Close modal">
            <X size={18} />
          </Button>
        </div>

        {/* Content viewport */}
        <div className="p-6 overflow-y-auto flex-1">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
