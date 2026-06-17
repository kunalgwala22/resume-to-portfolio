import prisma from '../../config/database';

export class AnalyticsRepository {
  async getOverview(userId: string) {
    const totalViews = await prisma.portfolioView.count({
      where: { userId }
    });

    const uniqueVisitors = await prisma.portfolioView.groupBy({
      by: ['ip'],
      where: { userId }
    });

    const avgTimeSpent = await prisma.portfolioView.aggregate({
      where: { userId },
      _avg: { timeSpent: true }
    });

    return {
      totalViews,
      uniqueVisitors: uniqueVisitors.length,
      averageTimeSpent: Math.round(avgTimeSpent._avg.timeSpent || 0)
    };
  }

  async getTimeSeriesViews(userId: string, limitDays = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - limitDays);

    const views = await prisma.portfolioView.findMany({
      where: {
        userId,
        createdAt: { gte: startDate }
      },
      select: { createdAt: true }
    });

    // Group in memory for simple compatibility across DBs
    const grouped: Record<string, number> = {};
    for (let i = limitDays - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateString = d.toISOString().split('T')[0];
      grouped[dateString] = 0;
    }

    views.forEach((v: any) => {
      const dateString = v.createdAt.toISOString().split('T')[0];
      if (grouped[dateString] !== undefined) {
        grouped[dateString]++;
      }
    });

    return Object.keys(grouped).map(date => ({
      date,
      views: grouped[date]
    }));
  }

  async getCountryBreakdown(userId: string) {
    const breakdown = await prisma.portfolioView.groupBy({
      by: ['country'],
      where: { userId },
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } }
    });

    return breakdown.map((item: any) => ({
      country: item.country || 'Unknown',
      count: item._count.id
    }));
  }

  async getDeviceBreakdown(userId: string) {
    const breakdown = await prisma.portfolioView.groupBy({
      by: ['device'],
      where: { userId },
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } }
    });

    return breakdown.map((item: any) => ({
      device: item.device || 'desktop',
      count: item._count.id
    }));
  }

  async recordView(userId: string, details: { ip: string, country?: string, city?: string, device?: string, browser?: string, referer?: string }) {
    return prisma.portfolioView.create({
      data: {
        userId,
        ip: details.ip,
        country: details.country || 'Unknown',
        city: details.city || 'Unknown',
        device: details.device || 'desktop',
        browser: details.browser || 'Other',
        referer: details.referer || null
      }
    });
  }
}

export const analyticsRepository = new AnalyticsRepository();
export default analyticsRepository;
