import { z } from 'zod';

export const portfolioUpdateSchema = z.object({
  templateId: z.string().min(1, 'Template selection is required').optional(),
  title: z.string().min(1, 'Portfolio title is required').max(100, 'Title cannot exceed 100 characters').optional(),
  headline: z.string().max(200, 'Headline cannot exceed 200 characters').optional().nullable(),
  summary: z.string().max(1000, 'Summary cannot exceed 1000 characters').optional().nullable(),
  isPublished: z.boolean().optional(),
  customDomain: z.string()
    .regex(/^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]$/, 'Invalid domain format')
    .optional()
    .nullable()
    .or(z.literal(''))
    .transform((val) => (val === '' ? null : val)),
  seoTitle: z.string().max(100, 'SEO title cannot exceed 100 characters').optional().nullable(),
  seoDescription: z.string().max(300, 'SEO description cannot exceed 300 characters').optional().nullable(),
  themeColor: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Theme color must be a valid hex code').default('#7C3AED').optional(),
});

export type PortfolioUpdateInput = z.infer<typeof portfolioUpdateSchema>;
