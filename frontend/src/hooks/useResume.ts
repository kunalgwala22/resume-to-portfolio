import { useEffect, useRef } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { resumeApi } from '../api/resume.api';
import { UpdateResumeSectionsInput } from '@portfolioverse/shared';

export const useResume = (resumeId?: string) => {
  const queryClient = useQueryClient();

  const listQuery = useQuery({
    queryKey: ['resumes'],
    queryFn: () => resumeApi.list()
  });

  const getQuery = useQuery({
    queryKey: ['resume', resumeId],
    queryFn: () => resumeApi.get(resumeId!),
    enabled: !!resumeId,
    refetchInterval: (query) => {
      const resume = query.state.data;
      if (resume && (resume.parseStatus === 'PENDING' || resume.parseStatus === 'PROCESSING')) {
        return 1500; // Poll every 1.5 seconds until complete
      }
      return false;
    }
  });

  const resume = getQuery.data;
  const prevStatusRef = useRef<string | null>(null);

  useEffect(() => {
    if (resume) {
      const prevStatus = prevStatusRef.current;
      const currentStatus = resume.parseStatus;
      
      if (
        (prevStatus === 'PENDING' || prevStatus === 'PROCESSING') &&
        currentStatus === 'COMPLETED'
      ) {
        queryClient.invalidateQueries({ queryKey: ['resumes'] });
        queryClient.invalidateQueries({ queryKey: ['resume', resumeId] });
        queryClient.invalidateQueries({ queryKey: ['portfolio'] });
        queryClient.invalidateQueries({ queryKey: ['portfolioSettings'] });
        queryClient.invalidateQueries({ queryKey: ['publicPortfolio'] });
      }
      
      prevStatusRef.current = currentStatus;
    }
  }, [resume, queryClient]);

  const uploadMutation = useMutation({
    mutationFn: (file: File) => resumeApi.upload(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resumes'] });
      queryClient.invalidateQueries({ queryKey: ['publicPortfolio'] });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => resumeApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resumes'] });
      queryClient.invalidateQueries({ queryKey: ['portfolio'] });
      queryClient.invalidateQueries({ queryKey: ['portfolioSettings'] });
      queryClient.invalidateQueries({ queryKey: ['publicPortfolio'] });
    }
  });

  const activateMutation = useMutation({
    mutationFn: (id: string) => resumeApi.activate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resumes'] });
      queryClient.invalidateQueries({ queryKey: ['portfolio'] });
      queryClient.invalidateQueries({ queryKey: ['portfolioSettings'] });
      queryClient.invalidateQueries({ queryKey: ['publicPortfolio'] });
      queryClient.invalidateQueries({ queryKey: ['me'] });
    }
  });

  const updateSectionsMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateResumeSectionsInput }) =>
      resumeApi.updateSections(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['resumes'] });
      queryClient.invalidateQueries({ queryKey: ['resume', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['portfolio'] });
      queryClient.invalidateQueries({ queryKey: ['portfolioSettings'] });
      queryClient.invalidateQueries({ queryKey: ['publicPortfolio'] });
    }
  });

  return {
    resumes: listQuery.data || [],
    isLoadingResumes: listQuery.isLoading,
    refetchResumes: listQuery.refetch,
    resume: getQuery.data || null,
    isLoadingResume: getQuery.isLoading,
    uploadResume: uploadMutation.mutateAsync,
    isUploading: uploadMutation.isPending,
    deleteResume: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
    activateResume: activateMutation.mutateAsync,
    isActivating: activateMutation.isPending,
    updateSections: updateSectionsMutation.mutateAsync,
    isUpdatingSections: updateSectionsMutation.isPending
  };
};

export default useResume;
