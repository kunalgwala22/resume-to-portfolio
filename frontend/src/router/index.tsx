import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import Landing from '../pages/Landing';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import Dashboard from '../pages/dashboard/Dashboard';
import ResumeUploadPage from '../pages/dashboard/ResumeUploadPage';
import ResumeEditorPage from '../pages/dashboard/ResumeEditorPage';
import TemplatesPage from '../pages/dashboard/TemplatesPage';
import PortfolioSettings from '../pages/dashboard/PortfolioSettings';
import AnalyticsPage from '../pages/dashboard/AnalyticsPage';
import PublicPortfolioPage from '../pages/portfolio/PublicPortfolioPage';
import NotFound from '../pages/NotFound';
import ServerError from '../pages/ServerError';

import ProtectedRoute from './ProtectedRoute';
import DashboardLayout from '../components/layout/DashboardLayout';
import PublicLayout from '../components/layout/PublicLayout';

export const router = createBrowserRouter([
  // Public Landing / Auth routes
  {
    path: '/',
    element: <Landing />
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/register',
    element: <Register />
  },

  // Public candidates view routes
  {
    element: <PublicLayout />,
    children: [
      {
        path: '/portfolio/:username',
        element: <PublicPortfolioPage />
      }
    ]
  },

  // Protected Dashboard Area routes
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          {
            path: '/dashboard',
            element: <Dashboard />
          },
          {
            path: '/dashboard/resumes',
            element: <Navigate to="/dashboard" replace />
          },
          {
            path: '/dashboard/resumes/upload',
            element: <ResumeUploadPage />
          },
          {
            path: '/dashboard/resumes/edit/:id',
            element: <ResumeEditorPage />
          },
          {
            path: '/dashboard/templates',
            element: <TemplatesPage />
          },
          {
            path: '/dashboard/analytics',
            element: <AnalyticsPage />
          },
          {
            path: '/dashboard/settings',
            element: <PortfolioSettings />
          }
        ]
      }
    ]
  },

  // Error boundary pages
  {
    path: '/500',
    element: <ServerError />
  },
  {
    path: '*',
    element: <NotFound />
  }
]);

export default router;
