import apiClient from './client';
import { RegisterInput, LoginInput, AuthResponseData } from '@portfolioverse/shared';

export const authApi = {
  register: async (data: RegisterInput): Promise<AuthResponseData> => {
    const res = await apiClient.post('/auth/register', data);
    return res.data.data;
  },
  login: async (data: LoginInput): Promise<AuthResponseData> => {
    const res = await apiClient.post('/auth/login', data);
    return res.data.data;
  },
  logout: async (): Promise<void> => {
    await apiClient.post('/auth/logout');
  },
  me: async (): Promise<AuthResponseData> => {
    const res = await apiClient.get('/auth/me');
    return res.data.data;
  }
};

export default authApi;
