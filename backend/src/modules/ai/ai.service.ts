import prisma from '../../config/database';
import { getRecruiterResponse, generateBioFromResume } from '../../lib/openai';
import { portfolioService } from '../portfolio/portfolio.service';
import { env } from '../../config/env';

export class AIService {
  async generateBio(userId: string): Promise<string> {
    const activeResume = await prisma.resume.findFirst({
      where: { userId, isActive: true, deletedAt: null },
      include: { skills: true }
    });

    if (!activeResume) {
      throw { 
        statusCode: 400, 
        message: 'No active resume found. Please upload and activate a resume first.', 
        code: 'ACTIVE_RESUME_REQUIRED' 
      };
    }

    const bio = await generateBioFromResume(activeResume.parsedData || {});

    // Save to User's bio
    await prisma.user.update({
      where: { id: userId },
      data: { bio }
    });

    // Log the AI usage report
    await prisma.aIReport.create({
      data: {
        userId,
        prompt: 'Generate portfolio bio description from active resume',
        response: bio,
        tokensUsed: 150,
        model: env.OPENAI_MODEL
      }
    });

    return bio;
  }

  async chatWithRecruiter(username: string, messages: { role: 'user' | 'assistant'; content: string }[]) {
    // 1. Resolve candidate's public details
    const portfolioData = await portfolioService.getPublicPortfolio(username);
    
    // Resolve candidate's internal DB ID to link the report
    const candidate = await prisma.user.findFirst({
      where: { username: username.toLowerCase(), deletedAt: null }
    });

    if (!candidate) {
      throw { statusCode: 404, message: 'Candidate not found', code: 'CANDIDATE_NOT_FOUND' };
    }

    const userQuestion = messages[messages.length - 1]?.content || '';

    // 2. Fetch answer from OpenAI
    const aiResult = await getRecruiterResponse(
      portfolioData.user.fullName || username,
      portfolioData,
      messages
    );

    // 3. Log usage data
    await prisma.aIReport.create({
      data: {
        userId: candidate.id,
        prompt: `Recruiter Question: ${userQuestion.slice(0, 300)}`,
        response: aiResult.response,
        tokensUsed: aiResult.tokensUsed,
        model: env.OPENAI_MODEL
      }
    });

    return aiResult.response;
  }
}

export const aiService = new AIService();
export default aiService;
