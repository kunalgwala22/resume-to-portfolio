import OpenAI from 'openai';
import { env } from '../config/env';
import { ResumeParsedData } from '@portfolioverse/shared';

// Initialize openai, conditionally if key is present
const openai = env.OPENAI_API_KEY ? new OpenAI({ apiKey: env.OPENAI_API_KEY }) : null;

// Prompts
const PARSE_SYSTEM_PROMPT = `You are an expert resume parser. Extract all information from the
provided resume text into strict JSON following the schema below. Be precise.
Do not infer data not present in the resume. Return ONLY valid JSON.

Schema: {
  "fullName": "string",
  "email": "string",
  "phone": "string",
  "location": "string",
  "summary": "string",
  "skills": [{ "name": "string", "level": "BEGINNER" | "INTERMEDIATE" | "ADVANCED" | "EXPERT", "category": "string" }],
  "experiences": [{ "company": "string", "role": "string", "location": "string", "startDate": "ISOString", "endDate": "ISOString | null", "isCurrent": boolean, "description": "string", "achievements": ["string"] }],
  "educations": [{ "institution": "string", "degree": "string", "field": "string", "startDate": "ISOString", "endDate": "ISOString | null", "grade": "string", "description": "string" }],
  "projects": [{ "name": "string", "description": "string", "techStack": ["string"], "liveUrl": "string | null", "repoUrl": "string | null" }],
  "certifications": [{ "name": "string", "issuer": "string", "issueDate": "ISOString | null", "expiryDate": "ISOString | null", "credentialId": "string | null", "credentialUrl": "string | null" }],
  "socialLinks": [{ "platform": "string", "url": "string" }]
}`;

export const parseResumeText = async (text: string): Promise<ResumeParsedData> => {
  if (!openai || !env.OPENAI_API_KEY || env.OPENAI_API_KEY === 'mock') {
    console.warn('⚠️ OpenAI API Key is missing. Using heuristic resume parser fallback.');
    return parseResumeHeuristically(text);
  }

  const response = await openai.chat.completions.create({
    model: env.OPENAI_MODEL,
    messages: [
      { role: 'system', content: PARSE_SYSTEM_PROMPT },
      { role: 'user', content: text },
    ],
    response_format: { type: 'json_object' },
  });

  const content = response.choices[0].message.content;
  if (!content) {
    throw new Error('Failed to parse resume: empty response from OpenAI');
  }

  return JSON.parse(content) as ResumeParsedData;
};

export const getRecruiterResponse = async (
  candidateName: string,
  contextData: any,
  messages: { role: 'user' | 'assistant'; content: string }[]
): Promise<{ response: string; tokensUsed: number }> => {
  if (!openai) {
    return {
      response: `[MOCK AI] Thank you for asking about ${candidateName}. Since OpenAI is not configured, here is mock information: Jane is an expert in ${contextData.skills?.slice(0, 3).map((s: any) => s.name).join(', ') || 'Software Development'} with professional experiences at ${contextData.experiences?.[0]?.company || 'TechCorp'}.`,
      tokensUsed: 100
    };
  }

  const contextPrompt = `System: You are an AI portfolio assistant for ${candidateName}.
You have full context of their portfolio below. Answer recruiter
questions accurately and concisely based only on this data.

Portfolio Context:
- Summary: ${contextData.summary || ''}
- Skills: ${JSON.stringify(contextData.skills || [])}
- Experience: ${JSON.stringify(contextData.experiences || [])}
- Projects: ${JSON.stringify(contextData.projects || [])}
- Education: ${JSON.stringify(contextData.educations || [])}
- Certifications: ${JSON.stringify(contextData.certifications || [])}

Rules:
- Never fabricate information not in the context
- If unsure, say "The candidate's portfolio doesn't mention this"
- Keep responses professional and recruiter-friendly`;

  const formattedMessages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
    { role: 'system', content: contextPrompt },
    ...messages.map(m => ({
      role: m.role,
      content: m.content
    } as OpenAI.Chat.Completions.ChatCompletionMessageParam))
  ];

  const response = await openai.chat.completions.create({
    model: env.OPENAI_MODEL,
    messages: formattedMessages
  });

  return {
    response: response.choices[0].message.content || "The candidate's portfolio doesn't mention this",
    tokensUsed: response.usage?.total_tokens || 0
  };
};

export const generateBioFromResume = async (resumeData: any): Promise<string> => {
  if (!openai) {
    const mainSkills = resumeData.skills?.slice(0, 3).map((s: any) => s.name).join(', ') || 'TypeScript and React';
    return `Passionate Software Engineer with expertise in ${mainSkills}. Experienced in building user-focused web products and solving complex architectural problems.`;
  }

  const response = await openai.chat.completions.create({
    model: env.OPENAI_MODEL,
    messages: [
      { role: 'system', content: 'You are a professional portfolio writer. Generate a short, compelling 2-3 sentence bio for a website hero section based on the user\'s resume details. Do not include greetings, introductions, or markdown. Output raw text only.' },
      { role: 'user', content: JSON.stringify(resumeData) }
    ]
  });

  return response.choices[0].message.content?.trim() || '';
};

function parseDateHeuristically(dateStr: string): Date {
  const clean = dateStr.trim();
  // Match 4-digit years starting with 19 or 20, ignoring word boundaries to support strings like Sep2025
  const yearMatch = clean.match(/(19|20)\d{2}/);
  if (!yearMatch) return new Date();
  
  const year = parseInt(yearMatch[0]);
  let month = 0;
  
  const months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
  for (let i = 0; i < months.length; i++) {
    if (clean.toLowerCase().includes(months[i])) {
      month = i;
      break;
    }
  }
  
  return new Date(year, month, 1);
}

function cleanSplitDates(text: string): string {
  const monthYearOrPresent = '(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|[0-9]{4}|present|current)';
  
  // Replace: Month/Year \n Dash -> Month/Year Dash
  let cleaned = text.replace(new RegExp(`(${monthYearOrPresent})[a-z]*\\.?\\r?\\n\\s*([-–—])`, 'gi'), '$1 $2');
  
  // Replace: Dash \n Month/Year/Present -> Dash Month/Year/Present
  cleaned = cleaned.replace(new RegExp(`([-–—])\\r?\\n\\s*(${monthYearOrPresent})`, 'gi'), '$1 $2');
  
  // Replace: Month \n Year -> Month Year
  cleaned = cleaned.replace(/\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\.?\r?\\n\\s*([0-9]{4})\b/gi, '$1 $2');
  
  return cleaned;
}

function getSectionEndIndex(text: string, startIndex: number): number | undefined {
  const sections = [
    /\r?\n\s*(?:education|academic)/i,
    /\r?\n\s*(?:projects|personal projects|key projects)/i,
    /\r?\n\s*(?:certifications)/i,
    /\r?\n\s*(?:skills|core skills)/i
  ];
  let minIndex = -1;
  sections.forEach(regex => {
    const idx = text.search(regex);
    if (idx !== -1 && idx > startIndex) {
      if (minIndex === -1 || idx < minIndex) {
        minIndex = idx;
      }
    }
  });
  return minIndex !== -1 ? minIndex : undefined;
}

function parseResumeHeuristically(rawText: string): ResumeParsedData {
  const text = cleanSplitDates(rawText);
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);

  // 1. Basic Contact Details
  let fullName = '';
  for (let i = 0; i < Math.min(8, lines.length); i++) {
    const line = lines[i];
    if (
      line.length > 2 &&
      line.length < 40 &&
      !line.includes('@') &&
      !line.includes('http') &&
      !line.includes('www.') &&
      !/\d{5,}/.test(line) &&
      !/resume|cv|portfolio|experience|skills|education|projects/i.test(line)
    ) {
      fullName = line;
      break;
    }
  }
  if (!fullName) fullName = 'Resume Candidate';

  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
  const emailMatch = text.match(emailRegex);
  const email = emailMatch ? emailMatch[0] : 'candidate@example.com';

  const phoneRegex = /(?:\+?\d{1,3}[ -]?)?\(?\d{3}\)?[ -]?\d{3}[ -]?\d{4}/;
  const phoneMatch = text.match(phoneRegex);
  const phone = phoneMatch ? phoneMatch[0] : '';

  const locationRegex = /[A-Z][a-zA-Z\s.]+,\s\b[A-Z]{2}\b(?:\s\d{5})?/;
  const locationMatch = text.match(locationRegex);
  let location = locationMatch ? locationMatch[0] : '';
  if (!location) {
    const countries = ['India', 'United States', 'USA', 'United Kingdom', 'UK', 'Canada', 'Australia', 'Germany', 'France'];
    for (const country of countries) {
      const regex = new RegExp(`\\b${country}\\b`, 'i');
      if (regex.test(text)) {
        const cityCountryRegex = new RegExp(`([A-Z][a-zA-Z\\s]{2,20}),\\s*${country}`, 'i');
        const cityMatch = text.match(cityCountryRegex);
        if (cityMatch) {
          location = cityMatch[0];
        } else {
          location = country;
        }
        break;
      }
    }
  }
  if (!location) location = 'Remote';

  // 2. Identify Section Blocks via Keyword Matching
  const sectionKeywords = [
    { key: 'summary', regex: /\r?\n\s*(?:summary|about|profile|objective|professional summary)\b/i },
    { key: 'skills', regex: /\r?\n\s*(?:skills|technical skills|core competencies|technologies|skills & expertise|key skills)\b/i },
    { key: 'experiences', regex: /\r?\n\s*(?:experience|work experience|professional experience|employment history|work history)\b/i },
    { key: 'educations', regex: /\r?\n\s*(?:education|academic background|qualifications|academic profile|education details)\b/i },
    { key: 'projects', regex: /\r?\n\s*(?:projects|personal projects|key projects|academic projects|technical projects)\b/i },
    { key: 'certifications', regex: /\r?\n\s*(?:certifications|licenses|courses|awards)\b/i },
  ];

  const sectionIndices: { key: string; index: number }[] = [];
  sectionKeywords.forEach(sec => {
    const match = text.match(sec.regex);
    if (match && match.index !== undefined) {
      sectionIndices.push({ key: sec.key, index: match.index });
    }
  });

  sectionIndices.sort((a, b) => a.index - b.index);

  const sectionTexts: Record<string, string> = {};
  for (let i = 0; i < sectionIndices.length; i++) {
    const current = sectionIndices[i];
    const next = sectionIndices[i + 1];
    const start = current.index;
    const end = next ? next.index : text.length;
    
    let blockText = text.substring(start, end);
    const firstNewline = blockText.indexOf('\n');
    if (firstNewline !== -1) {
      blockText = blockText.substring(firstNewline).trim();
    }
    sectionTexts[current.key] = blockText;
  }

  // 3. Extract Summary Section
  let summary = '';
  if (sectionTexts.summary) {
    summary = sectionTexts.summary.replace(/\r?\n/g, ' ').replace(/\s+/g, ' ').trim();
  } else {
    const candidateLineIdx = lines.indexOf(fullName);
    let startIdx = candidateLineIdx !== -1 ? candidateLineIdx + 1 : 0;
    while (startIdx < lines.length && (lines[startIdx].includes('@') || lines[startIdx].includes('+') || /\d{10}/.test(lines[startIdx]))) {
      startIdx++;
    }
    if (startIdx < lines.length) {
      summary = lines[startIdx];
      if (lines[startIdx + 1] && !lines[startIdx + 1].startsWith('-') && !lines[startIdx + 1].startsWith('•')) {
        summary += ' ' + lines[startIdx + 1];
      }
    }
  }
  if (!summary || summary.length < 15) {
    summary = `Experienced professional specializing in software development. Skilled at designing robust applications.`;
  }

  // 4. Extract Skills Section
  const commonSkills = [
    'JavaScript', 'TypeScript', 'React', 'Angular', 'Vue', 'Node.js', 'Express',
    'NestJS', 'Python', 'Django', 'Flask', 'Java', 'Spring', 'C++', 'C#', '.NET',
    'Ruby', 'Rails', 'PHP', 'Laravel', 'SQL', 'PostgreSQL', 'MySQL', 'MongoDB',
    'Redis', 'AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'CI/CD', 'Git',
    'HTML', 'CSS', 'Tailwind', 'Sass', 'GraphQL', 'REST API', 'Agile', 'Scrum'
  ];

  const skills: { name: string; level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT'; category: string }[] = [];
  const matchedSkillsSet = new Set<string>();

  const skillsSearchText = sectionTexts.skills || text;
  commonSkills.forEach(skill => {
    const escaped = skill.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    const regex = new RegExp(`\\b${escaped}\\b`, 'i');
    if (regex.test(skillsSearchText)) {
      matchedSkillsSet.add(skill);
      skills.push({
        name: skill,
        level: 'ADVANCED',
        category: 'Technical Skills'
      });
    }
  });

  if (skills.length === 0 && sectionTexts.skills) {
    const skillLines = sectionTexts.skills.split('\n');
    skillLines.forEach(line => {
      const parts = line.split(/[;,\/|]/);
      parts.forEach(p => {
        const cleanSkill = p.replace(/^[•-]\s*/, '').trim();
        if (cleanSkill && cleanSkill.length > 1 && cleanSkill.length < 30 && !matchedSkillsSet.has(cleanSkill)) {
          matchedSkillsSet.add(cleanSkill);
          skills.push({
            name: cleanSkill,
            level: 'INTERMEDIATE',
            category: 'Skills'
          });
        }
      });
    });
  }

  // 5. Extract Experience Section
  const experiences: {
    company: string;
    role: string;
    location: string;
    startDate: Date;
    endDate: Date | null;
    isCurrent: boolean;
    description: string;
    achievements: string[];
  }[] = [];

  const dateRangeRegex = /(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\.?\s*\d{2,4}\s*[-–—to\s]+\s*(?:present|current|\b(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\.?\s*\d{2,4}\b)/i;
  const yearRangeRegex = /\b(19|20)\d{2}\s*[-–—to\s]+\s*(?:present|current|\b(19|20)\d{2})\b/i;

  if (sectionTexts.experiences) {
    const expLines = sectionTexts.experiences.split('\n').map(l => l.trim()).filter(Boolean);
    let currentExp: any = null;

    expLines.forEach(line => {
      const hasDate = dateRangeRegex.test(line) || yearRangeRegex.test(line);
      const isBullet = line.startsWith('-') || line.startsWith('•') || line.startsWith('*');
      
      if (hasDate && !isBullet) {
        if (currentExp) {
          experiences.push(currentExp);
        }

        let company = 'Company';
        let role = 'Software Developer';
        let expLoc = 'Remote';
        let startDate = new Date();
        let endDate: Date | null = null;
        let isCurrent = false;

        const dateMatch = line.match(dateRangeRegex) || line.match(yearRangeRegex);
        let remainingLine = line;
        if (dateMatch) {
          const dateRangeStr = dateMatch[0];
          remainingLine = line.replace(dateRangeStr, '').trim();
          const dates = dateRangeStr.split(/[-–—to]/i).map(d => d.trim()).filter(Boolean);
          startDate = parseDateHeuristically(dates[0]);
          isCurrent = /present|current/i.test(dates[1] || '');
          endDate = isCurrent ? null : parseDateHeuristically(dates[1] || dates[0]);
        }

        const parts = remainingLine.split(/[|,\-–—]/).map(p => p.trim()).filter(Boolean);
        if (parts.length >= 2) {
          role = parts[0];
          company = parts[1];
          if (parts[2]) expLoc = parts[2];
        } else if (parts.length === 1) {
          company = parts[0];
        }

        currentExp = {
          company,
          role,
          location: expLoc,
          startDate,
          endDate,
          isCurrent,
          description: '',
          achievements: []
        };
      } else if (currentExp) {
        if (isBullet) {
          const achievement = line.replace(/^[•\-*]\s*/, '').trim();
          currentExp.achievements.push(achievement);
          currentExp.description += (currentExp.description ? ' ' : '') + achievement;
        } else {
          currentExp.description += (currentExp.description ? ' ' : '') + line;
        }
      }
    });

    if (currentExp) {
      experiences.push(currentExp);
    }
  }

  // 6. Extract Education Section
  const educations: {
    institution: string;
    degree: string;
    field: string;
    startDate: Date;
    endDate: Date | null;
    grade: string;
    description: string;
  }[] = [];

  if (sectionTexts.educations) {
    const eduLines = sectionTexts.educations.split('\n').map(l => l.trim()).filter(Boolean);
    let currentEdu: any = null;

    eduLines.forEach(line => {
      const hasDate = dateRangeRegex.test(line) || yearRangeRegex.test(line) || /\b(19|20)\d{2}\b/.test(line);
      const isDegree = /bachelor|master|degree|b\.tech|m\.tech|b\.sc|m\.sc|phd|diploma|graduation|secondary|hsc|ssc|school|college|university/i.test(line);

      if ((hasDate || isDegree) && !line.startsWith('-') && !line.startsWith('•')) {
        if (currentEdu) {
          educations.push(currentEdu);
        }

        let institution = 'University/School';
        let degree = 'Degree';
        let field = 'Field of Study';
        let startDate = new Date();
        let endDate: Date | null = null;

        const dateMatch = line.match(dateRangeRegex) || line.match(yearRangeRegex) || line.match(/\b(19|20)\d{2}\b/);
        let remainingLine = line;
        if (dateMatch) {
          const dateRangeStr = dateMatch[0];
          remainingLine = line.replace(dateRangeStr, '').trim();
          const dates = dateRangeStr.split(/[-–—to]/i).map(d => d.trim()).filter(Boolean);
          startDate = parseDateHeuristically(dates[0]);
          const isCurrent = /present|current/i.test(dates[1] || '');
          endDate = isCurrent ? null : parseDateHeuristically(dates[1] || dates[0]);
        }

        const parts = remainingLine.split(/[|,\-–—]/).map(p => p.trim()).filter(Boolean);
        if (parts.length >= 2) {
          degree = parts[0];
          institution = parts[1];
          if (parts[2]) field = parts[2];
        } else if (parts.length === 1) {
          institution = parts[0];
        }

        currentEdu = {
          institution,
          degree,
          field,
          startDate,
          endDate,
          grade: '',
          description: ''
        };
      } else if (currentEdu) {
        currentEdu.description += (currentEdu.description ? ' ' : '') + line;
      }
    });

    if (currentEdu) {
      educations.push(currentEdu);
    }
  }

  // 7. Extract Projects Section
  const projects: {
    name: string;
    description: string;
    techStack: string[];
    liveUrl: string | null;
    repoUrl: string | null;
    isFeatured: boolean;
    sortOrder: number;
  }[] = [];

  if (sectionTexts.projects) {
    const projLines = sectionTexts.projects.split('\n').map(l => l.trim()).filter(Boolean);
    let currentProj: any = null;

    projLines.forEach(line => {
      const isBullet = line.startsWith('-') || line.startsWith('•') || line.startsWith('*');
      
      if (!isBullet && line.length > 2 && line.length < 50 && /[A-Z]/.test(line[0])) {
        if (currentProj) {
          projects.push(currentProj);
        }

        let name = line;
        let repoUrl: string | null = null;
        let liveUrl: string | null = null;

        const urlMatches = line.match(/https?:\/\/[^\s]+|github\.com\/[^\s]+/gi);
        if (urlMatches) {
          urlMatches.forEach(url => {
            name = name.replace(url, '').replace(/[()\[\]|,\-–—]/g, '').trim();
            if (url.includes('github.com')) {
              repoUrl = url;
            } else {
              liveUrl = url;
            }
          });
        }

        currentProj = {
          name,
          description: '',
          techStack: [],
          liveUrl,
          repoUrl,
          isFeatured: true,
          sortOrder: projects.length
        };
      } else if (currentProj) {
        const urlMatches = line.match(/https?:\/\/[^\s]+|github\.com\/[^\s]+/gi);
        if (urlMatches) {
          urlMatches.forEach(url => {
            if (url.includes('github.com') && !currentProj.repoUrl) {
              currentProj.repoUrl = url;
            } else if (!currentProj.liveUrl) {
              currentProj.liveUrl = url;
            }
          });
        }

        const cleanLine = line.replace(/^[•\-*]\s*/, '').trim();
        currentProj.description += (currentProj.description ? ' ' : '') + cleanLine;

        commonSkills.forEach(skill => {
          const escaped = skill.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
          const regex = new RegExp(`\\b${escaped}\\b`, 'i');
          if (regex.test(line) && !currentProj.techStack.includes(skill)) {
            currentProj.techStack.push(skill);
          }
        });
      }
    });

    if (currentProj) {
      projects.push(currentProj);
    }
  }

  // 8. Extract Certifications Section
  const certifications: {
    name: string;
    issuer: string;
    issueDate: Date | null;
    expiryDate: Date | null;
    credentialId: string | null;
    credentialUrl: string | null;
  }[] = [];

  const certSearchText = sectionTexts.certifications || text;
  const linesForCerts = certSearchText.split('\n').map(l => l.trim()).filter(Boolean);
  linesForCerts.forEach(line => {
    if (/certi|course|udemy|coursera|license/i.test(line) && line.length > 5 && line.length < 120 && !line.startsWith('-') && !line.startsWith('•')) {
      const parts = line.split(/[|,\-–—]/).map(p => p.trim()).filter(Boolean);
      const name = parts[0];
      const issuer = parts[1] || 'Certification Authority';
      let issueDate: Date | null = null;
      
      const yearMatch = line.match(/\b(20\d{2})\b/);
      if (yearMatch) {
        issueDate = new Date(parseInt(yearMatch[0]), 0, 1);
      }
      
      certifications.push({
        name,
        issuer,
        issueDate,
        expiryDate: null,
        credentialId: null,
        credentialUrl: null
      });
    }
  });

  // 9. Extract Social Links
  const socialLinks: { platform: string; url: string }[] = [];
  const githubMatch = text.match(/(?:https?:\/\/)?(?:www\.)?github\.com\/[a-zA-Z0-9_-]+/i);
  if (githubMatch) {
    let url = githubMatch[0];
    if (!url.startsWith('http')) {
      url = 'https://' + url;
    }
    socialLinks.push({ platform: 'github', url });
  }
  const linkedinMatch = text.match(/(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/[a-zA-Z0-9_-]+/i);
  if (linkedinMatch) {
    let url = linkedinMatch[0];
    if (!url.startsWith('http')) {
      url = 'https://' + url;
    }
    socialLinks.push({ platform: 'linkedin', url });
  }

  return {
    fullName,
    email,
    phone,
    location,
    summary,
    skills,
    experiences,
    educations,
    projects,
    certifications,
    socialLinks
  };
}

function getMockParsedResume(): ResumeParsedData {
  return {
    fullName: 'Jane Smith',
    email: 'janesmith@example.com',
    phone: '+1 (555) 987-6543',
    location: 'New York, NY',
    summary: 'Senior Software Engineer with 6+ years of experience specialized in React, TypeScript and Node.js. Enthusiastic about creating accessible and elegant user experiences.',
    skills: [
      { name: 'JavaScript', level: 'EXPERT', category: 'Languages' },
      { name: 'TypeScript', level: 'EXPERT', category: 'Languages' },
      { name: 'React', level: 'EXPERT', category: 'Frontend' },
      { name: 'Node.js', level: 'ADVANCED', category: 'Backend' },
      { name: 'GraphQL', level: 'INTERMEDIATE', category: 'API' }
    ],
    experiences: [
      {
        company: 'Innovate Labs',
        role: 'Tech Lead',
        location: 'New York, NY',
        startDate: new Date('2021-06-01T00:00:00.000Z'),
        endDate: null,
        isCurrent: true,
        description: 'Manage a front-end engineering team building Next.js apps.',
        achievements: [
          'Decreased load times by 45% using image loading improvements and SSR caching.',
          'Built custom UI kit used across 4 internal products.'
        ]
      }
    ],
    educations: [
      {
        institution: 'Columbia University',
        degree: 'Master of Science',
        field: 'Software Engineering',
        startDate: new Date('2019-09-01T00:00:00.000Z'),
        endDate: new Date('2021-05-15T00:00:00.000Z'),
        grade: '3.9 GPA',
        description: 'Focus on Distributed Systems.'
      }
    ],
    projects: [
      {
        name: 'Omni Analytics',
        description: 'SaaS analytics tool displaying real-time events graphs.',
        techStack: ['Next.js', 'GraphQL', 'Tailwind CSS'],
        liveUrl: 'https://omnianalytics.dev',
        repoUrl: 'https://github.com/janesmith/omni-analytics',
        isFeatured: true,
        sortOrder: 1
      }
    ],
    certifications: [
      {
        name: 'Certified ScrumMaster',
        issuer: 'Scrum Alliance',
        issueDate: new Date('2022-10-01T00:00:00.000Z'),
        expiryDate: new Date('2024-10-01T00:00:00.000Z'),
        credentialId: 'CSM-551',
        credentialUrl: ''
      }
    ],
    socialLinks: [
      { platform: 'github', url: 'https://github.com/janesmith' },
      { platform: 'linkedin', url: 'https://linkedin.com/in/janesmith' }
    ]
  };
}

export default {
  parseResumeText,
  getRecruiterResponse,
  generateBioFromResume
};
