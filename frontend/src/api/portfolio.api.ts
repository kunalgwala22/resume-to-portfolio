import apiClient from './client';
import { PortfolioUpdateInput, PortfolioData } from '@portfolioverse/shared';

export const portfolioApi = {
  getSettings: async (): Promise<any> => {
    const res = await apiClient.get('/portfolio');
    return res.data.data.portfolio;
  },
  
  updateSettings: async (data: PortfolioUpdateInput): Promise<any> => {
    const res = await apiClient.put('/portfolio', data);
    return res.data.data.portfolio;
  },
  
  togglePublish: async (isPublished: boolean): Promise<any> => {
    const res = await apiClient.post('/portfolio/publish', { isPublished });
    return res.data.data.portfolio;
  },
  
  getPublicPortfolio: async (username: string): Promise<PortfolioData> => {
    const res = await apiClient.get(`/portfolio/public/${username}`);
    return res.data.data.portfolio;
  }
};

export default portfolioApi;
