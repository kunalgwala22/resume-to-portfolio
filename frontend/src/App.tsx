import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import router from './router';

import { useTheme } from './hooks/useTheme';

// Create a query client singleton
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // Prevents aggressive background re-fetches
      retry: 1, // Only retry failed requests once
      staleTime: 20 * 1000 // Cache is stale after 20 seconds
    }
  }
});

export const App: React.FC = () => {
  useTheme(); // Synchronize theme classes globally

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
};

export default App;
