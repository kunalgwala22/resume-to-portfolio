import apiClient from './client';

export const analyticsApi = {
  getOverview: async (): Promise<any> => {
    const res = await apiClient.get('/analytics/overview');
    return res.data.data;
  },
  
  getViews: async (days = 30): Promise<any[]> => {
    const res = await apiClient.get(`/analytics/views?days=${days}`);
    return res.data.data.views;
  },
  
  getCountries: async (): Promise<any[]> => {
    const res = await apiClient.get('/analytics/countries');
    return res.data.data.countries;
  },
  
  getDevices: async (): Promise<any[]> => {
    const res = await apiClient.get('/analytics/devices');
    return res.data.data.devices;
  },
  
  getTopProjects: async (): Promise<any[]> => {
    const res = await apiClient.get('/analytics/top-projects');
    return res.data.data.projects;
  },
  
  trackView: async (username: string): Promise<void> => {
    await apiClient.post('/analytics/view', { username });
  }
};

export default analyticsApi;
