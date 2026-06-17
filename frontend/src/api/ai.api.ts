import apiClient from './client';

export const aiApi = {
  generateBio: async (): Promise<string> => {
    const res = await apiClient.post('/ai/generate-bio');
    return res.data.data.bio;
  },
  
  chat: async (username: string, messages: { role: 'user' | 'assistant'; content: string }[]): Promise<string> => {
    const res = await apiClient.post('/ai/recruiter-chat', { username, messages });
    return res.data.data.reply;
  }
};

export default aiApi;
