import apiClient from './client';
import { UpdateResumeSectionsInput } from '@portfolioverse/shared';

export const resumeApi = {
  upload: async (file: File): Promise<any> => {
    const formData = new FormData();
    formData.append('file', file);
    
    const res = await apiClient.post('/resumes/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return res.data.data;
  },
  
  list: async (): Promise<any[]> => {
    const res = await apiClient.get('/resumes');
    return res.data.data.resumes;
  },
  
  get: async (id: string): Promise<any> => {
    const res = await apiClient.get(`/resumes/${id}`);
    return res.data.data.resume;
  },
  
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/resumes/${id}`);
  },
  
  activate: async (id: string): Promise<any> => {
    const res = await apiClient.post(`/resumes/${id}/activate`);
    return res.data.data.resume;
  },
  
  getSections: async (id: string): Promise<any> => {
    const res = await apiClient.get(`/resumes/${id}/sections`);
    return res.data.data;
  },
  
  updateSections: async (id: string, data: UpdateResumeSectionsInput): Promise<any> => {
    const res = await apiClient.put(`/resumes/${id}/sections`, data);
    return res.data.data.resume;
  }
};

export default resumeApi;
