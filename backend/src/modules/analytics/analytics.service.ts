import { analyticsRepository } from './analytics.repository';
import prisma from '../../config/database';

export class AnalyticsService {
  async getOverview(userId: string) {
    return analyticsRepository.getOverview(userId);
  }

  async getTimeSeries(userId: string, limitDays = 30) {
    return analyticsRepository.getTimeSeriesViews(userId, limitDays);
  }

  async getCountries(userId: string) {
    return analyticsRepository.getCountryBreakdown(userId);
  }

  async getDevices(userId: string) {
    return analyticsRepository.getDeviceBreakdown(userId);
  }

  async getTopProjects(userId: string) {
    // Return the user's projects with simulated view counts for the dashboard
    const activeResume = await prisma.resume.findFirst({
      where: { 
        userId, 
        isActive: true, 
        deletedAt: null 
      },
      include: { projects: true }
    });

    if (!activeResume || activeResume.projects.length === 0) {
      return [];
    }

    return activeResume.projects.map((p: any, idx: number) => ({
      id: p.id,
      name: p.name,
      views: p.isFeatured ? 350 - (idx * 25) : 120 - (idx * 15)
    })).sort((a: any, b: any) => b.views - a.views);
  }

  async trackView(username: string, details: { ip: string, country?: string, city?: string, device?: string, browser?: string, referer?: string }) {
    const user = await prisma.user.findFirst({
      where: { 
        username: username.toLowerCase(),
        deletedAt: null 
      }
    });

    if (!user) {
      throw { statusCode: 404, message: 'User not found', code: 'USER_NOT_FOUND' };
    }

    return analyticsRepository.recordView(user.id, details);
  }
}

export const analyticsService = new AnalyticsService();
export default analyticsService;
