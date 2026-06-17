import { resumeRepository } from './resume.repository';
import { parseResumeBuffer } from '../../lib/parseResume';
import { parseResumeText } from '../../lib/openai';
import cloudinary from '../../config/cloudinary';
import { ParseStatus } from '@prisma/client';
import { UpdateResumeSectionsDTO } from './resume.dto';
import { env } from '../../config/env';

export class ResumeService {
  async uploadAndParseResume(userId: string, fileBuffer: Buffer, originalName: string, mimeType: string) {
    const fileType = originalName.toLowerCase().endsWith('.docx') ? 'docx' : 'pdf';
    let fileUrl = 'https://res.cloudinary.com/dummy/image/upload/v12345/resume.pdf';

    try {
      if (env.CLOUDINARY_CLOUD_NAME && env.CLOUDINARY_API_KEY && env.CLOUDINARY_API_SECRET) {
        // Upload buffer to Cloudinary using raw format upload stream
        const uploadResult = await new Promise<any>((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            { 
              resource_type: 'raw', 
              folder: 'resumes', 
              public_id: `resume_${userId}_${Date.now()}`,
              filename_override: originalName
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );
          uploadStream.end(fileBuffer);
        });
        fileUrl = uploadResult.secure_url;
      }
    } catch (error) {
      if (env.NODE_ENV !== 'test') {
        console.warn('⚠️ Cloudinary upload failed or unconfigured, using dummy URL.', error);
      }
    }

    // Create the pending database entry first (so the client gets an immediate status response)
    const resume = await resumeRepository.createPendingResume(userId, originalName, fileUrl, fileType);

    // Launch AI Parsing Job in the background
    (async () => {
      try {
        await resumeRepository.updateParseStatus(resume.id, ParseStatus.PROCESSING);

        // 1. Extract raw text from document buffer
        const text = await parseResumeBuffer(fileBuffer, fileType);
        console.log("--- START EXTRACTED TEXT ---");
        console.log(text);
        console.log("--- END EXTRACTED TEXT ---");

        // 2. Query LLM to parse text into structured JSON format
        const parsedJSON = await parseResumeText(text);

        // 3. Seed related Skills, Experience, Education, Projects databases
        await resumeRepository.populateResumeSubTables(resume.id, parsedJSON);

        // 4. Save structured JSON to Resume record and mark parseStatus as COMPLETED
        await resumeRepository.updateParseStatus(resume.id, ParseStatus.COMPLETED, parsedJSON);

        // 5. Make the newly uploaded resume active by default
        await resumeRepository.activateResume(userId, resume.id);
      } catch (error) {
        console.error(`💥 Background parsing failed for resume ID ${resume.id}:`, error);
        await resumeRepository.updateParseStatus(resume.id, ParseStatus.FAILED);
      }
    })();

    return resume;
  }

  async listResumes(userId: string) {
    return resumeRepository.listResumes(userId);
  }

  async getResume(userId: string, id: string) {
    const resume = await resumeRepository.getResumeById(userId, id);
    if (!resume) {
      throw { statusCode: 404, message: 'Resume not found', code: 'RESUME_NOT_FOUND' };
    }
    return resume;
  }

  async deleteResume(userId: string, id: string) {
    await this.getResume(userId, id);
    return resumeRepository.softDelete(userId, id);
  }

  async activateResume(userId: string, id: string) {
    await this.getResume(userId, id);
    return resumeRepository.activateResume(userId, id);
  }

  async updateResumeSections(userId: string, id: string, data: UpdateResumeSectionsDTO) {
    await this.getResume(userId, id);
    return resumeRepository.updateSections(userId, id, data);
  }
}

export const resumeService = new ResumeService();
export default resumeService;
