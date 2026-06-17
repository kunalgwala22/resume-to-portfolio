import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { HelpCircle, Home } from 'lucide-react';

export const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md flex flex-col items-center gap-4">
        <div className="h-16 w-16 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary animate-pulse">
          <HelpCircle size={32} />
        </div>
        <h1 className="text-4xl font-black font-display text-white tracking-tight">404</h1>
        <h2 className="text-xl font-bold text-gray-300">Page Not Found</h2>
        <p className="text-sm text-gray-400">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        <Link to="/" className="mt-4">
          <Button size="sm" className="flex items-center gap-2">
            <Home size={14} />
            <span>Go Back Home</span>
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
