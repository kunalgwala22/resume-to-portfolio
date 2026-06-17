import { z } from 'zod';

export const skillLevelSchema = z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT']);

export const skillSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Skill name is required'),
  level: skillLevelSchema.default('INTERMEDIATE'),
  category: z.string().optional().nullable(),
});

export const experienceSchema = z.object({
  id: z.string().optional(),
  company: z.string().min(1, 'Company name is required'),
  role: z.string().min(1, 'Role name is required'),
  location: z.string().optional().nullable(),
  startDate: z.any().transform((val) => (val ? new Date(val) : null)),
  endDate: z.any().transform((val) => (val ? new Date(val) : null)).optional().nullable(),
  isCurrent: z.boolean().default(false),
  description: z.string().optional().nullable(),
  achievements: z.array(z.string()).default([]),
});

export const educationSchema = z.object({
  id: z.string().optional(),
  institution: z.string().min(1, 'Institution is required'),
  degree: z.string().min(1, 'Degree is required'),
  field: z.string().optional().nullable(),
  startDate: z.any().transform((val) => (val ? new Date(val) : null)),
  endDate: z.any().transform((val) => (val ? new Date(val) : null)).optional().nullable(),
  grade: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
});

export const projectSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Project name is required'),
  description: z.string().optional().nullable(),
  techStack: z.array(z.string()).default([]),
  liveUrl: z.string().optional().nullable(),
  repoUrl: z.string().optional().nullable(),
  imageUrl: z.string().optional().nullable(),
  isFeatured: z.boolean().default(false),
  sortOrder: z.number().int().default(0),
});

export const certificationSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Certification name is required'),
  issuer: z.string().min(1, 'Issuer name is required'),
  issueDate: z.any().transform((val) => (val ? new Date(val) : null)).optional().nullable(),
  expiryDate: z.any().transform((val) => (val ? new Date(val) : null)).optional().nullable(),
  credentialId: z.string().optional().nullable(),
  credentialUrl: z.string().optional().nullable(),
});

export const socialLinkSchema = z.object({
  id: z.string().optional(),
  platform: z.string().min(1, 'Platform is required'),
  url: z.string().url('Invalid URL'),
});

export const resumeParsedDataSchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional().nullable(),
  location: z.string().optional().nullable(),
  summary: z.string().optional().nullable(),
  skills: z.array(skillSchema).default([]),
  experiences: z.array(experienceSchema).default([]),
  educations: z.array(educationSchema).default([]),
  projects: z.array(projectSchema).default([]),
  certifications: z.array(certificationSchema).default([]),
  socialLinks: z.array(socialLinkSchema).default([]),
});

export const updateResumeSectionsSchema = z.object({
  skills: z.array(skillSchema).optional(),
  experiences: z.array(experienceSchema).optional(),
  educations: z.array(educationSchema).optional(),
  projects: z.array(projectSchema).optional(),
  certifications: z.array(certificationSchema).optional(),
  socialLinks: z.array(socialLinkSchema).optional(),
});

export type SkillInput = z.infer<typeof skillSchema>;
export type ExperienceInput = z.infer<typeof experienceSchema>;
export type EducationInput = z.infer<typeof educationSchema>;
export type ProjectInput = z.infer<typeof projectSchema>;
export type CertificationInput = z.infer<typeof certificationSchema>;
export type SocialLinkInput = z.infer<typeof socialLinkSchema>;
export type ResumeParsedData = z.infer<typeof resumeParsedDataSchema>;
export type UpdateResumeSectionsInput = z.infer<typeof updateResumeSectionsSchema>;
