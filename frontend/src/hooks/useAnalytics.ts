import { useQuery } from '@tanstack/react-query';
import { analyticsApi } from '../api/analytics.api';

export const useAnalytics = (days = 30) => {
  const overviewQuery = useQuery({
    queryKey: ['analyticsOverview'],
    queryFn: () => analyticsApi.getOverview()
  });

  const viewsQuery = useQuery({
    queryKey: ['analyticsViews', days],
    queryFn: () => analyticsApi.getViews(days)
  });

  const countriesQuery = useQuery({
    queryKey: ['analyticsCountries'],
    queryFn: () => analyticsApi.getCountries()
  });

  const devicesQuery = useQuery({
    queryKey: ['analyticsDevices'],
    queryFn: () => analyticsApi.getDevices()
  });

  const topProjectsQuery = useQuery({
    queryKey: ['analyticsTopProjects'],
    queryFn: () => analyticsApi.getTopProjects()
  });

  return {
    overview: overviewQuery.data || { totalViews: 0, uniqueVisitors: 0, averageTimeSpent: 0 },
    isLoadingOverview: overviewQuery.isLoading,
    views: viewsQuery.data || [],
    isLoadingViews: viewsQuery.isLoading,
    countries: countriesQuery.data || [],
    isLoadingCountries: countriesQuery.isLoading,
    devices: devicesQuery.data || [],
    isLoadingDevices: devicesQuery.isLoading,
    topProjects: topProjectsQuery.data || [],
    isLoadingTopProjects: topProjectsQuery.isLoading
  };
};

export default useAnalytics;
