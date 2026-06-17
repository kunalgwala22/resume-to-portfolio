import prisma from '../../config/database';
import { ParseStatus, SkillLevel } from '@prisma/client';
import { UpdateResumeSectionsDTO } from './resume.dto';

export class ResumeRepository {
  async listResumes(userId: string) {
    return prisma.resume.findMany({
      where: {
        userId,
        deletedAt: null
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  }

  async getResumeById(userId: string, id: string) {
    return prisma.resume.findFirst({
      where: {
        id,
        userId,
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
    });
  }

  async createPendingResume(userId: string, originalName: string, fileUrl: string, fileType: string) {
    return prisma.resume.create({
      data: {
        userId,
        originalName,
        fileUrl,
        fileType,
        parseStatus: ParseStatus.PENDING,
        isActive: false
      }
    });
  }

  async updateParseStatus(id: string, status: ParseStatus, parsedData?: any) {
    return prisma.resume.update({
      where: { id },
      data: {
        parseStatus: status,
        parsedData: parsedData || null
      }
    });
  }

  async populateResumeSubTables(id: string, parsedData: any) {
    return prisma.$transaction(async (tx: any) => {
      // 1. Clear any existing relations (safeguard)
      await tx.skill.deleteMany({ where: { resumeId: id } });
      await tx.experience.deleteMany({ where: { resumeId: id } });
      await tx.education.deleteMany({ where: { resumeId: id } });
      await tx.project.deleteMany({ where: { resumeId: id } });
      await tx.certification.deleteMany({ where: { resumeId: id } });
      await tx.socialLink.deleteMany({ where: { resumeId: id } });

      // 2. Insert new ones
      if (parsedData.skills && parsedData.skills.length > 0) {
        await tx.skill.createMany({
          data: parsedData.skills.map((s: any) => ({
            resumeId: id,
            name: s.name,
            level: (s.level || 'INTERMEDIATE') as SkillLevel,
            category: s.category || null
          }))
        });
      }

      if (parsedData.experiences && parsedData.experiences.length > 0) {
        await tx.experience.createMany({
          data: parsedData.experiences.map((e: any) => ({
            resumeId: id,
            company: e.company,
            role: e.role,
            location: e.location || null,
            startDate: e.startDate ? new Date(e.startDate) : new Date(),
            endDate: e.endDate ? new Date(e.endDate) : null,
            isCurrent: e.isCurrent || false,
            description: e.description || null,
            achievements: e.achievements || []
          }))
        });
      }

      if (parsedData.educations && parsedData.educations.length > 0) {
        await tx.education.createMany({
          data: parsedData.educations.map((ed: any) => ({
            resumeId: id,
            institution: ed.institution,
            degree: ed.degree,
            field: ed.field || null,
            startDate: ed.startDate ? new Date(ed.startDate) : new Date(),
            endDate: ed.endDate ? new Date(ed.endDate) : null,
            grade: ed.grade || null,
            description: ed.description || null
          }))
        });
      }

      if (parsedData.projects && parsedData.projects.length > 0) {
        await tx.project.createMany({
          data: parsedData.projects.map((p: any, idx: number) => ({
            resumeId: id,
            name: p.name,
            description: p.description || null,
            techStack: p.techStack || [],
            liveUrl: p.liveUrl || null,
            repoUrl: p.repoUrl || null,
            isFeatured: false,
            sortOrder: idx
          }))
        });
      }

      if (parsedData.certifications && parsedData.certifications.length > 0) {
        await tx.certification.createMany({
          data: parsedData.certifications.map((c: any) => ({
            resumeId: id,
            name: c.name,
            issuer: c.issuer,
            issueDate: c.issueDate ? new Date(c.issueDate) : null,
            expiryDate: c.expiryDate ? new Date(c.expiryDate) : null,
            credentialId: c.credentialId || null,
            credentialUrl: c.credentialUrl || null
          }))
        });
      }

      const linksToInsert = (parsedData.socialLinks || []).map((sl: any) => ({
        resumeId: id,
        platform: sl.platform.toLowerCase(),
        url: sl.url
      }));

      if (parsedData.email && !linksToInsert.some((sl: any) => sl.platform === 'email' || sl.platform === 'mail')) {
        linksToInsert.push({
          resumeId: id,
          platform: 'email',
          url: parsedData.email.startsWith('mailto:') ? parsedData.email : `mailto:${parsedData.email}`
        });
      }

      if (linksToInsert.length > 0) {
        await tx.socialLink.createMany({
          data: linksToInsert
        });
      }
    });
  }

  async softDelete(userId: string, id: string) {
    return prisma.resume.update({
      where: { id, userId },
      data: { deletedAt: new Date() }
    });
  }

  async activateResume(userId: string, id: string) {
    return prisma.$transaction(async (tx: any) => {
      // 1. Deactivate all resumes for this user
      await tx.resume.updateMany({
        where: { userId, isActive: true },
        data: { isActive: false }
      });
      // 2. Activate specific resume
      const activeResume = await tx.resume.update({
        where: { id, userId },
        data: { isActive: true }
      });

      // 3. Auto-update/populate the user's name & bio in user table if active resume updates
      if (activeResume.parsedData) {
        const parsed = activeResume.parsedData as any;
        await tx.user.update({
          where: { id: userId },
          data: {
            fullName: parsed.fullName || null,
            bio: parsed.summary || null
          }
        });
      }
      return activeResume;
    });
  }

  async updateSections(userId: string, id: string, data: UpdateResumeSectionsDTO) {
    return prisma.$transaction(async (tx: any) => {
      // Fetch existing parsedData to merge
      const resume = await tx.resume.findFirst({
        where: { id, userId, deletedAt: null }
      });

      if (!resume) {
        throw new Error('Resume not found');
      }

      const currentParsedData = (resume.parsedData || {}) as any;

      if (data.skills) {
        await tx.skill.deleteMany({ where: { resumeId: id } });
        if (data.skills.length > 0) {
          await tx.skill.createMany({
            data: data.skills.map((s) => ({
              resumeId: id,
              name: s.name,
              level: (s.level || 'INTERMEDIATE') as SkillLevel,
              category: s.category || null
            }))
          });
        }
        currentParsedData.skills = data.skills;
      }

      if (data.experiences) {
        await tx.experience.deleteMany({ where: { resumeId: id } });
        if (data.experiences.length > 0) {
          await tx.experience.createMany({
            data: data.experiences.map((e) => ({
              resumeId: id,
              company: e.company,
              role: e.role,
              location: e.location || null,
              startDate: e.startDate ? new Date(e.startDate) : new Date(),
              endDate: e.endDate ? new Date(e.endDate) : null,
              isCurrent: e.isCurrent || false,
              description: e.description || null,
              achievements: e.achievements || []
            }))
          });
        }
        currentParsedData.experiences = data.experiences;
      }

      if (data.educations) {
        await tx.education.deleteMany({ where: { resumeId: id } });
        if (data.educations.length > 0) {
          await tx.education.createMany({
            data: data.educations.map((ed) => ({
              resumeId: id,
              institution: ed.institution,
              degree: ed.degree,
              field: ed.field || null,
              startDate: ed.startDate ? new Date(ed.startDate) : new Date(),
              endDate: ed.endDate ? new Date(ed.endDate) : null,
              grade: ed.grade || null,
              description: ed.description || null
            }))
          });
        }
        currentParsedData.educations = data.educations;
      }

      if (data.projects) {
        await tx.project.deleteMany({ where: { resumeId: id } });
        if (data.projects.length > 0) {
          await tx.project.createMany({
            data: data.projects.map((p, idx) => ({
              resumeId: id,
              name: p.name,
              description: p.description || null,
              techStack: p.techStack || [],
              liveUrl: p.liveUrl || null,
              repoUrl: p.repoUrl || null,
              isFeatured: p.isFeatured || false,
              sortOrder: p.sortOrder !== undefined ? p.sortOrder : idx
            }))
          });
        }
        currentParsedData.projects = data.projects;
      }

      if (data.certifications) {
        await tx.certification.deleteMany({ where: { resumeId: id } });
        if (data.certifications.length > 0) {
          await tx.certification.createMany({
            data: data.certifications.map((c) => ({
              resumeId: id,
              name: c.name,
              issuer: c.issuer,
              issueDate: c.issueDate ? new Date(c.issueDate) : null,
              expiryDate: c.expiryDate ? new Date(c.expiryDate) : null,
              credentialId: c.credentialId || null,
              credentialUrl: c.credentialUrl || null
            }))
          });
        }
        currentParsedData.certifications = data.certifications;
      }

      if (data.socialLinks) {
        await tx.socialLink.deleteMany({ where: { resumeId: id } });
        if (data.socialLinks.length > 0) {
          await tx.socialLink.createMany({
            data: data.socialLinks.map((sl) => ({
              resumeId: id,
              platform: sl.platform.toLowerCase(),
              url: sl.url
            }))
          });
        }
        currentParsedData.socialLinks = data.socialLinks;
      }

      // Update the main resume record JSON parsedData
      const updatedResume = await tx.resume.update({
        where: { id },
        data: {
          parsedData: currentParsedData
        },
        include: {
          skills: true,
          experiences: { orderBy: { startDate: 'desc' } },
          educations: { orderBy: { startDate: 'desc' } },
          projects: { orderBy: { sortOrder: 'asc' } },
          certifications: { orderBy: { issueDate: 'desc' } },
          socialLinks: true
        }
      });

      // Auto-update user's bio if this is the active resume
      if (updatedResume.isActive) {
        await tx.user.update({
          where: { id: userId },
          data: {
            fullName: currentParsedData.fullName || null,
            bio: currentParsedData.summary || null
          }
        });
      }

      return updatedResume;
    });
  }
}

export const resumeRepository = new ResumeRepository();
export default resumeRepository;
