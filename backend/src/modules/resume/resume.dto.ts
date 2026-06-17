import { UpdateResumeSectionsInput } from '@portfolioverse/shared';

export type UpdateResumeSectionsDTO = UpdateResumeSectionsInput;

export interface ResumeResponse {
  id: string;
  userId: string;
  originalName: string;
  fileUrl: string;
  fileType: string;
  parseStatus: string;
  parsedData: any;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
