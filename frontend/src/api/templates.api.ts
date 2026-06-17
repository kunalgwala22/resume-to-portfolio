import apiClient from './client';

export const templatesApi = {
  list: async (): Promise<any[]> => {
    const res = await apiClient.get('/templates');
    return res.data.data.templates;
  },
  
  get: async (slug: string): Promise<any> => {
    const res = await apiClient.get(`/templates/${slug}`);
    return res.data.data.template;
  }
};

export default templatesApi;
