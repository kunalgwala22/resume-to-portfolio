import { SkillInput, ExperienceInput, EducationInput, ProjectInput, CertificationInput, SocialLinkInput } from '../schemas/resume.schema';

export interface PortfolioData {
  user: {
    fullName: string | null;
    avatarUrl: string | null;
    username: string;
    bio: string | null;
  };
  headline: string;
  summary: string;
  skills: SkillInput[];
  experiences: ExperienceInput[];
  educations: EducationInput[];
  projects: ProjectInput[];
  certifications: CertificationInput[];
  socialLinks: SocialLinkInput[];
  themeColor: string;
  isPublished?: boolean;
  templateId: string;
}
