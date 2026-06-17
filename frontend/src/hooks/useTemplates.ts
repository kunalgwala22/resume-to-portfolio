import { useQuery } from '@tanstack/react-query';
import { templatesApi } from '../api/templates.api';

export const useTemplates = () => {
  const listQuery = useQuery({
    queryKey: ['templates'],
    queryFn: () => templatesApi.list()
  });

  return {
    templates: listQuery.data || [],
    isLoadingTemplates: listQuery.isLoading
  };
};

export default useTemplates;
