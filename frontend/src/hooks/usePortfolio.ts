import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { portfolioApi } from '../api/portfolio.api';
import { PortfolioUpdateInput } from '@portfolioverse/shared';

export const usePortfolio = (username?: string) => {
  const queryClient = useQueryClient();

  const settingsQuery = useQuery({
    queryKey: ['portfolioSettings'],
    queryFn: () => portfolioApi.getSettings(),
    enabled: !username
  });

  const publicQuery = useQuery({
    queryKey: ['publicPortfolio', username],
    queryFn: () => portfolioApi.getPublicPortfolio(username!),
    enabled: !!username,
    staleTime: 5 * 60 * 1000, // Cache for 5 mins as requested
    retry: false
  });

  const updateMutation = useMutation({
    mutationFn: (data: PortfolioUpdateInput) => portfolioApi.updateSettings(data),
    onSuccess: (data) => {
      queryClient.setQueryData(['portfolioSettings'], data);
      queryClient.invalidateQueries({ queryKey: ['portfolio'] });
      queryClient.invalidateQueries({ queryKey: ['publicPortfolio'] });
      queryClient.invalidateQueries({ queryKey: ['me'] });
    }
  });

  const publishMutation = useMutation({
    mutationFn: (isPublished: boolean) => portfolioApi.togglePublish(isPublished),
    onSuccess: (data) => {
      queryClient.setQueryData(['portfolioSettings'], data);
      queryClient.invalidateQueries({ queryKey: ['portfolio'] });
      queryClient.invalidateQueries({ queryKey: ['publicPortfolio'] });
    }
  });

  return {
    settings: settingsQuery.data || null,
    isLoadingSettings: settingsQuery.isLoading,
    publicPortfolio: publicQuery.data || null,
    isLoadingPublic: publicQuery.isLoading,
    publicError: publicQuery.error,
    updateSettings: updateMutation.mutateAsync,
    isUpdatingSettings: updateMutation.isPending,
    togglePublish: publishMutation.mutateAsync,
    isTogglingPublish: publishMutation.isPending
  };
};

export default usePortfolio;
