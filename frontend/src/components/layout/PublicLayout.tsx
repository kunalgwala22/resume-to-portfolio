import React from 'react';
import { Outlet } from 'react-router-dom';

export const PublicLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-dark text-gray-100 flex flex-col justify-between">
      <div className="flex-grow">
        <Outlet />
      </div>
    </div>
  );
};

export default PublicLayout;
