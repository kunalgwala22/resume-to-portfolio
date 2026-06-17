import { portfolioRepository } from './portfolio.repository';
import { PortfolioUpdateDTO } from './portfolio.dto';
import { PortfolioData } from '@portfolioverse/shared';

export class PortfolioService {
  async getPortfolio(userId: string) {
    let portfolio = await portfolioRepository.getPortfolioByUserId(userId);
    if (!portfolio) {
      // Auto-create a default portfolio for the user on first load
      portfolio = await portfolioRepository.upsertPortfolio(userId, {});
    }
    return portfolio;
  }

  async updatePortfolio(userId: string, data: PortfolioUpdateDTO) {
    return portfolioRepository.upsertPortfolio(userId, data);
  }

  async publishToggle(userId: string, isPublished: boolean) {
    return portfolioRepository.upsertPortfolio(userId, { isPublished });
  }

  async getPublicPortfolio(username: string, requesterUserId?: string): Promise<PortfolioData> {
    const result = await portfolioRepository.getPublicPortfolioByUsername(username);
    if (!result) {
      throw { statusCode: 404, message: 'Portfolio not found or is set to private', code: 'PORTFOLIO_NOT_FOUND' };
    }

    const { user, portfolio, activeResume } = result;

    // Optional ownership check for draft/unpublished portfolios
    if (!portfolio.isPublished && user.id !== requesterUserId) {
      throw { statusCode: 404, message: 'Portfolio not found or is set to private', code: 'PORTFOLIO_NOT_FOUND' };
    }

    const resolvedSocialLinks = activeResume?.socialLinks.map((sl: any) => ({
      id: sl.id,
      platform: sl.platform,
      url: sl.url
    })) || [];

    const hasEmail = resolvedSocialLinks.some((sl: any) => sl.platform.toLowerCase() === 'email' || sl.platform.toLowerCase() === 'mail');
    if (!hasEmail) {
      const parsedEmail = (activeResume?.parsedData as any)?.email || user.email;
      if (parsedEmail) {
        resolvedSocialLinks.push({
          id: 'auto-email',
          platform: 'email',
          url: parsedEmail.startsWith('mailto:') ? parsedEmail : `mailto:${parsedEmail}`
        });
      }
    }

    // Map nested DB entities directly into clean PortfolioData object matching frontend contracts
    return {
      templateId: portfolio.templateId,
      user: {
        fullName: user.fullName,
        avatarUrl: user.avatarUrl,
        username: user.username,
        bio: user.bio
      },
      headline: portfolio.headline || (activeResume?.experiences[0]?.role) || '',
      summary: portfolio.summary || (activeResume?.parsedData as any)?.summary || '',
      themeColor: portfolio.themeColor,
      isPublished: portfolio.isPublished,
      skills: activeResume?.skills.map((s: any) => ({
        id: s.id,
        name: s.name,
        level: s.level,
        category: s.category
      })) || [],
      experiences: activeResume?.experiences.map((e: any) => ({
        id: e.id,
        company: e.company,
        role: e.role,
        location: e.location,
        startDate: e.startDate,
        endDate: e.endDate,
        isCurrent: e.isCurrent,
        description: e.description,
        achievements: e.achievements
      })) || [],
      educations: activeResume?.educations.map((ed: any) => ({
        id: ed.id,
        institution: ed.institution,
        degree: ed.degree,
        field: ed.field,
        startDate: ed.startDate,
        endDate: ed.endDate,
        grade: ed.grade,
        description: ed.description
      })) || [],
      projects: activeResume?.projects.map((p: any) => ({
        id: p.id,
        name: p.name,
        description: p.description,
        techStack: p.techStack,
        liveUrl: p.liveUrl,
        repoUrl: p.repoUrl,
        imageUrl: p.imageUrl,
        isFeatured: p.isFeatured,
        sortOrder: p.sortOrder
      })) || [],
      certifications: activeResume?.certifications.map((c: any) => ({
        id: c.id,
        name: c.name,
        issuer: c.issuer,
        issueDate: c.issueDate,
        expiryDate: c.expiryDate,
        credentialId: c.credentialId,
        credentialUrl: c.credentialUrl
      })) || [],
      socialLinks: resolvedSocialLinks
    };
  }
}

export const portfolioService = new PortfolioService();
export default portfolioService;
