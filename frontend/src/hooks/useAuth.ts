import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authApi } from '../api/auth.api';
import { useAuthStore } from '../stores/auth.store';
import { RegisterInput, LoginInput } from '@portfolioverse/shared';

export const useAuth = () => {
  const queryClient = useQueryClient();
  const { setAuth, clearAuth } = useAuthStore();

  const loginMutation = useMutation({
    mutationFn: (data: LoginInput) => authApi.login(data),
    onSuccess: (data) => {
      setAuth(data.user, data.accessToken);
      queryClient.setQueryData(['me'], data.user);
    }
  });

  const registerMutation = useMutation({
    mutationFn: (data: RegisterInput) => authApi.register(data),
    onSuccess: (data) => {
      setAuth(data.user, data.accessToken);
      queryClient.setQueryData(['me'], data.user);
    }
  });

  const logoutMutation = useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: () => {
      clearAuth();
      queryClient.clear();
    }
  });

  const meQuery = useQuery({
    queryKey: ['me'],
    queryFn: async () => {
      const data = await authApi.me();
      if (data && data.user) {
        // Keep Zustand synced
        const currentToken = useAuthStore.getState().accessToken;
        if (currentToken) {
          setAuth(data.user, currentToken);
        }
      }
      return data;
    },
    enabled: !!useAuthStore.getState().accessToken,
    retry: false
  });

  return {
    login: loginMutation.mutateAsync,
    isLoggingIn: loginMutation.isPending,
    loginError: loginMutation.error,
    register: registerMutation.mutateAsync,
    isRegistering: registerMutation.isPending,
    registerError: registerMutation.error,
    logout: logoutMutation.mutate,
    isLoggingOut: logoutMutation.isPending,
    user: meQuery.data?.user || useAuthStore.getState().user,
    isLoadingUser: meQuery.isLoading,
    refetchMe: meQuery.refetch
  };
};

export default useAuth;
