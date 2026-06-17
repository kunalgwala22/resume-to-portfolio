import prisma from '../../config/database';

export class TemplatesService {
  async listTemplates() {
    return prisma.template.findMany({
      orderBy: { sortOrder: 'asc' }
    });
  }

  async getTemplateBySlug(slug: string) {
    const template = await prisma.template.findUnique({
      where: { slug }
    });
    
    if (!template) {
      throw { statusCode: 404, message: 'Template not found', code: 'TEMPLATE_NOT_FOUND' };
    }
    
    return template;
  }
}

export const templatesService = new TemplatesService();
export default templatesService;
