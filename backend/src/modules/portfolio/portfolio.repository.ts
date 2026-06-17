import prisma from '../../config/database';
import { PortfolioUpdateDTO } from './portfolio.dto';

export class PortfolioRepository {
  async getPortfolioByUserId(userId: string) {
    return prisma.portfolio.findUnique({
      where: { userId },
      include: {
        template: true
      }
    });
  }

  async upsertPortfolio(userId: string, data: PortfolioUpdateDTO) {
    const defaultTemplate = await prisma.template.findFirst({
      orderBy: { sortOrder: 'asc' }
    });

    const templateId = data.templateId || defaultTemplate?.id || 'tmpl-clean-starter';

    return prisma.portfolio.upsert({
      where: { userId },
      update: {
        templateId: data.templateId,
        title: data.title,
        headline: data.headline,
        summary: data.summary,
        isPublished: data.isPublished,
        customDomain: data.customDomain,
        seoTitle: data.seoTitle,
        seoDescription: data.seoDescription,
        themeColor: data.themeColor
      },
      create: {
        userId,
        templateId,
        title: data.title || 'My Professional Portfolio',
        headline: data.headline || 'Welcome to my digital space',
        summary: data.summary || '',
        isPublished: data.isPublished !== undefined ? data.isPublished : false,
        customDomain: data.customDomain,
        seoTitle: data.seoTitle || 'My Portfolio',
        seoDescription: data.seoDescription || '',
        themeColor: data.themeColor || '#7C3AED'
      },
      include: {
        template: true
      }
    });
  }

  async getPublicPortfolioByUsername(username: string) {
    const user = await prisma.user.findFirst({
      where: {
        username: username.toLowerCase(),
        deletedAt: null
      },
      include: {
        portfolio: {
          where: { deletedAt: null },
          include: { template: true }
        },
        resumes: {
          where: {
            isActive: true,
            deletedAt: null
          },
          include: {
            skills: true,
            experiences: { orderBy: { startDate: 'desc' } },
            educations: { orderBy: { startDate: 'desc' } },
            projects: { orderBy: { sortOrder: 'asc' } },
            certifications: { orderBy: { issueDate: 'desc' } },
            socialLinks: true
          }
        }
      }
    });

    if (!user || !user.portfolio) {
      return null;
    }

    const activeResume = user.resumes[0] || null;

    return {
      user,
      portfolio: user.portfolio,
      activeResume
    };
  }
}

export const portfolioRepository = new PortfolioRepository();
export default portfolioRepository;
