import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

export const DashboardLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-dark text-gray-100">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 sm:p-8 overflow-y-auto max-h-[calc(100vh-64px)] bg-dark/20">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
