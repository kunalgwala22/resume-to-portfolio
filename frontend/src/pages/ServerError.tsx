import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { AlertOctagon, RefreshCw } from 'lucide-react';

export const ServerError: React.FC = () => {
  return (
    <div className="min-h-screen bg-dark text-gray-100 flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md flex flex-col items-center gap-4">
        <div className="h-16 w-16 rounded-full bg-danger/10 border border-danger/20 flex items-center justify-center text-danger">
          <AlertOctagon size={32} />
        </div>
        <h1 className="text-4xl font-black font-display text-gray-100 tracking-tight">500</h1>
        <h2 className="text-xl font-bold text-gray-300">Internal Server Error</h2>
        <p className="text-sm text-gray-400">
          Something went wrong on our end. Please try reloading the page, or contact support if the issue persists.
        </p>
        <div className="flex items-center gap-3 mt-4">
          <Button size="sm" onClick={() => window.location.reload()} className="flex items-center gap-2" variant="outline">
            <RefreshCw size={14} />
            <span>Reload Page</span>
          </Button>
          <Link to="/">
            <Button size="sm" className="flex items-center gap-2">
              <span>Back to Home</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ServerError;
