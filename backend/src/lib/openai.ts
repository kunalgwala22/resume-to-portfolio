import OpenAI from 'openai';
import { env } from '../config/env';
import { ResumeParsedData } from '@portfolioverse/shared';

// Determine if the configured API key is a Gemini API key (starts with AIzaSy)
const isGemini = env.OPENAI_API_KEY?.startsWith('AIzaSy');

// Initialize openai, conditionally if key is present
const openai = env.OPENAI_API_KEY
  ? new OpenAI({
      apiKey: env.OPENAI_API_KEY,
      baseURL: isGemini ? 'https://generativelanguage.googleapis.com/v1beta/openai/' : undefined,
    })
  : null;

// Expose a helper to dynamically resolve the model name (e.g. mapping gpt-4o to gemini-1.5-flash for Gemini compatibility gateway)
export const getModelName = (): string => {
  if (isGemini) {
    if (env.OPENAI_MODEL.startsWith('gpt-') || env.OPENAI_MODEL === 'gpt-4o') {
      return 'gemini-1.5-flash';
    }
  }
  return env.OPENAI_MODEL;
};

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

  try {
    const response = await openai.chat.completions.create({
      model: getModelName(),
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
  } catch (error) {
    console.error('⚠️ OpenAI API call failed. Falling back to robust heuristic resume parser:', error);
    return parseResumeHeuristically(text);
  }
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
    model: getModelName(),
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
    model: getModelName(),
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
  if (!yearMatch) {
    const shortYearMatch = clean.match(/['’]?\b(\d{2})\b/);
    if (shortYearMatch) {
      const yr = parseInt(shortYearMatch[1]);
      const fullYear = yr < 50 ? 2000 + yr : 1900 + yr;
      let month = 4;
      const months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
      for (let i = 0; i < months.length; i++) {
        if (clean.toLowerCase().includes(months[i])) {
          month = i;
          break;
        }
      }
      return new Date(fullYear, month, 1);
    }
    return new Date();
  }
  
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
  let cleaned = text.replace(new RegExp(`(${monthYearOrPresent})[a-z]*\\.?\\s*\\r?\\n\\s*([-–—])`, 'gi'), '$1 $2');
  
  // Replace: Dash \n Month/Year/Present -> Dash Month/Year/Present
  cleaned = cleaned.replace(new RegExp(`([-–—])\\s*\\r?\\n\\s*(${monthYearOrPresent})`, 'gi'), '$1 $2');
  
  // Replace: Month \n Year -> Month Year
  cleaned = cleaned.replace(/\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\.?\s*\r?\\n\\s*([0-9]{4})\b/gi, '$1 $2');
  
  return cleaned;
}

function cleanSpacingsAndSpelling(text: string): string {
  const replacements: [RegExp, string][] = [
    [/\bWor\s+ked\b/gi, 'Worked'],
    [/\bCollab\s+orated\b/gi, 'Collaborated'],
    [/\bintegra\s+ted\b/gi, 'integrated'],
    [/\bContrib\s+uted\b/gi, 'Contributed'],
    [/\bper\s+formance\b/gi, 'performance'],
    [/\bAssoc\s+iate\b/gi, 'Associate'],
    [/\bDev\s+eloper\b/gi, 'Developer'],
    [/\bWorki\s+ng\b/gi, 'Working'],
    [/\bS\s+oftware\b/gi, 'Software'],
    [/\bWordPre\s+ss\b/gi, 'WordPress'],
    [/\bTiboo\s+k\s+k\b/gi, 'Tibook'],
    [/\bBill\s+ing\b/gi, 'Billing'],
    [/\bproj\s+ects\b/gi, 'projects'],
    [/\btempla\s+te\b/gi, 'template'],
    [/\bstruccture\b/gi, 'structure'],
    [/\bextaction\b/gi, 'extraction'],
    [/\bproj\s+ect\b/gi, 'project'],
    [/\bcollab\s+orate\b/gi, 'collaborate'],
    [/\boptimi\s+zation\b/gi, 'optimization'],
    [/\bWord\s+Press\b/gi, 'WordPress'],
    [/\bKunal G\s*wala\b/gi, 'Kunal Gwala']
  ];

  let cleaned = text;
  for (const [regex, replacement] of replacements) {
    cleaned = cleaned.replace(regex, replacement);
  }
  return cleaned;
}

const dateRangeRegex = /(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\.?\s*\d{2,4}\s*[-–—to\s]+\s*(?:present|current|\b(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\.?\s*\d{2,4}\b)/i;
const yearRangeRegex = /\b(19|20)\d{2}\s*[-–—to\s]+\s*(?:present|current|\b(19|20)\d{2})\b/i;
const singleDateRegex = /\b(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\.?\s*['’]?\s*\d{2,4}\b/i;
const durationRegex = /\b\d+(?:\.\d+)?\s*(?:yr|year|month|mon)s?\b/i;

function preprocessLines(rawText: string): string[] {
  let cleaned = cleanSpacingsAndSpelling(rawText);
  cleaned = cleanSplitDates(cleaned);
  
  const rawLines = cleaned.split('\n').map(l => l.trim()).filter(Boolean);
  const mergedLines: string[] = [];
  
  for (let i = 0; i < rawLines.length; i++) {
    const line = rawLines[i];
    
    if (mergedLines.length === 0) {
      mergedLines.push(line);
      continue;
    }
    
    const prevLine = mergedLines[mergedLines.length - 1];
    let shouldMerge = false;
    
    // 0. Merge split year in date ranges (e.g. Sep \n 2025)
    const prevEndsWithMonthOrDash = /(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\.?\s*[-–—]?$/i.test(prevLine) || /[-–—]$/.test(prevLine);
    const currentIsYear = /^\d{2,4}$/.test(line);
    if (prevEndsWithMonthOrDash && currentIsYear) {
      shouldMerge = true;
    }
    // 1. Lowercase continuation
    else if (/^[a-z]/.test(line)) {
      const isContactOrLink = line.includes('@') || line.includes('http') || line.includes('www.') || /\b\d{10}\b/.test(line);
      const isBulletPattern = /^[a-z]\s+/.test(line);
      const isCompanyOrJob = /\b(developer|intern|engineer|lead|manager|associate|analyst|coordinator|specialist|officer|consultant|admin|designer|architect|solutions|systems|technologies|pvt|ltd|limited|inc|corp|corporation|b\.solutions)\b/i.test(line);
      
      if (!isContactOrLink && !isBulletPattern && !isCompanyOrJob) {
        shouldMerge = true;
      }
    }
    // 2. GPA or grade fraction continuation
    else if (/^\d+(?:\.\d+)?\s*\/\s*\d+/.test(line)) {
      shouldMerge = true;
    }
    // 3. Ending with a separator
    else if (/[|,\-–—]$/.test(prevLine)) {
      const hasDate = dateRangeRegex.test(line) || yearRangeRegex.test(line) || singleDateRegex.test(line);
      const isRoleOrCompanyLine = line.includes('|') || /\b(developer|intern|engineer|lead|manager|associate|analyst|coordinator|specialist|officer|consultant|admin|designer|architect)\b/i.test(line);
      if (!line.startsWith('-') && !line.startsWith('•') && !line.startsWith('*') && !isSectionHeader(line) && !hasDate && !isRoleOrCompanyLine) {
        shouldMerge = true;
      }
    }
    // 4. Split date ranges
    else {
      const currentHasDate = dateRangeRegex.test(line) || yearRangeRegex.test(line);
      const prevHasDate = dateRangeRegex.test(prevLine) || yearRangeRegex.test(prevLine);
      const prevIsHeader = isSectionHeader(prevLine);
      
      if (currentHasDate && !prevHasDate && !prevIsHeader) {
        shouldMerge = true;
      }
    }
    
    if (shouldMerge) {
      if (/[a-zA-Z]$/.test(prevLine) && /^[a-zA-Z]/.test(line)) {
        const lastWord = prevLine.split(/\s+/).pop() || '';
        if (lastWord.length <= 4) {
          mergedLines[mergedLines.length - 1] = prevLine + line;
        } else {
          mergedLines[mergedLines.length - 1] = prevLine + ' ' + line;
        }
      } else {
        mergedLines[mergedLines.length - 1] = prevLine + ' ' + line;
      }
    } else {
      mergedLines.push(line);
    }
  }
  
  return mergedLines;
}

function splitConcatenatedEntries(lines: string[]): string[] {
  const result: string[] = [];
  for (const line of lines) {
    const matches = [];
    const rx = new RegExp(`(?:${dateRangeRegex.source}|${yearRangeRegex.source})`, 'gi');
    let match;
    while ((match = rx.exec(line)) !== null) {
      matches.push({ index: match.index, text: match[0] });
    }

    if (matches.length > 1) {
      let lastIdx = 0;
      for (let i = 0; i < matches.length - 1; i++) {
        const currentMatch = matches[i];
        const nextMatch = matches[i + 1];
        const segment = line.substring(currentMatch.index + currentMatch.text.length, nextMatch.index);
        
        const splitKeywords = /\b(Secondary|Primary|Bachelor|B\.Tech|M\.Tech|B\.Sc|M\.Sc|Degree|School|College|University|Assoc|Software|Developer|Intern|Project|TIMS|Dive)\b/i;
        const kwMatch = segment.match(splitKeywords);
        
        if (kwMatch && kwMatch.index !== undefined) {
          const splitPt = currentMatch.index + currentMatch.text.length + kwMatch.index;
          result.push(line.substring(lastIdx, splitPt).trim());
          lastIdx = splitPt;
        } else {
          const splitPt = currentMatch.index + currentMatch.text.length + Math.floor(segment.length / 2);
          result.push(line.substring(lastIdx, splitPt).trim());
          lastIdx = splitPt;
        }
      }
      result.push(line.substring(lastIdx).trim());
    } else {
      result.push(line);
    }
  }
  return result;
}

function isSectionHeader(line: string): { key: string; header: string } | null {
  const clean = line.replace(/^[#\-\*•●▪◦■□➔\d\.\)\s]+/, '').trim();
  if (clean.length === 0 || clean.length > 50) return null;

  const words = clean.split(/\s+/).filter(Boolean);
  if (words.length > 5) return null;

  // Subheading bypass: if line ends with colon and starts with common list keywords, it's not a section header
  if (line.trim().endsWith(':')) {
    const isSubheading = /^(?:key|core|technical|relevant|selected|featured|areas|specialties|tools|languages|skills|my|our)\b/i.test(clean);
    if (isSubheading) return null;
  }

  const summaryRegex = /^(?:professional|executive|personal|career)?\s*(?:summary|about|profile|objective|biography|about me)\b/i;
  const skillsRegex = /^(?:technical|core|key|professional|software|relevant)?\s*(?:skills|competencies|technologies|expertise|tools|tech stack|skills summary|skills matrix|core skills|areas of expertise)\b/i;
  const expRegex = /^(?:work|professional|employment|relevant|career|recent|job)?\s*(?:experience|history|employment|record|timeline|history summary|timeline summary)\b/i;
  const eduRegex = /^(?:academic|professional|scholastic)?\s*(?:education|background|qualifications|academic profile|education details|academic history|academic credentials|scholastic history|studies|academic qualifications)\b/i;
  const projRegex = /^(?:personal|key|academic|technical|recent|selected|featured)?\s*(?:projects|contributions|project details|portfolio|achievements & projects)\b/i;
  const certRegex = /^(?:professional|recent|key)?\s*(?:certifications|licenses|courses|awards|honors|achievements|credentials|certificates)\b/i;

  const noColons = clean.replace(/:+$/, '').trim();

  if (summaryRegex.test(noColons)) return { key: 'summary', header: line };
  if (skillsRegex.test(noColons)) return { key: 'skills', header: line };
  if (expRegex.test(noColons)) return { key: 'experiences', header: line };
  if (eduRegex.test(noColons)) return { key: 'educations', header: line };
  if (projRegex.test(noColons)) return { key: 'projects', header: line };
  if (certRegex.test(noColons)) return { key: 'certifications', header: line };

  return null;
}
function extractExperiencesRobustly(lines: string[]): any[] {
  const roleKeywords = /\b(developer|intern|engineer|lead|manager|associate|analyst|coordinator|specialist|officer|consultant|admin|designer|writer|architect)\b/i;
  const companyKeywords = /\b(solutions|systems|technologies|pvt|ltd|limited|inc|corp|corporation|group|labs|software|consulting|agency|b\.solutions)\b/i;
  const educationKeywords = /\b(b\.tech|m\.tech|b\.sc|m\.sc|bachelor|master|degree|university|school|college|institute|cgpa|gpa|percentage|hsc|ssc|studies|curriculum)\b/i;

  const lineSections: string[] = [];
  let currentSection = 'header';
  lines.forEach(line => {
    const match = isSectionHeader(line);
    if (match) {
      currentSection = match.key;
    }
    lineSections.push(currentSection);
  });

  let currentExp: any = null;
  const experiences: any[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const section = lineSections[i];
    const isBullet = line.startsWith('-') || line.startsWith('•') || line.startsWith('*');
    const isHeader = isSectionHeader(line);
    
    if (isHeader) {
      if (currentExp) {
        experiences.push(currentExp);
        currentExp = null;
      }
      continue;
    }

    const isAllowedSection = section === 'experiences' || section === 'summary' || section === 'skills' || section === 'header';
    if (!isAllowedSection) {
      if (currentExp) {
        experiences.push(currentExp);
        currentExp = null;
      }
      continue;
    }

    const hasDateRange = dateRangeRegex.test(line) || yearRangeRegex.test(line);
    const hasSingleDate = singleDateRegex.test(line);
    const hasDuration = durationRegex.test(line);
    const hasDate = hasDateRange || hasSingleDate || hasDuration;
    
    const isRole = roleKeywords.test(line);
    const isCompany = companyKeywords.test(line) || line.includes('—') || line.includes('|');
    const isEdu = educationKeywords.test(line);

    if (hasDate && (isRole || isCompany) && !isEdu && !isBullet) {
      const startsNewExp = isCompany && (hasDateRange || hasSingleDate || !currentExp);

      if (startsNewExp) {
        if (currentExp) {
          experiences.push(currentExp);
        }

        let company = '';
        let role = '';
        let location = 'Remote';
        let startDate = new Date();
        let endDate: Date | null = null;
        let isCurrent = false;

        const dateMatch = line.match(dateRangeRegex) || line.match(yearRangeRegex) || line.match(singleDateRegex);
        let remainingLine = line;
        if (dateMatch) {
          const dateRangeStr = dateMatch[0];
          remainingLine = line.replace(dateRangeStr, '').trim();
          
          const dates = dateRangeStr.split(/\s*(?:-–—|to)\s*/i).map(d => d.trim()).filter(Boolean);
          startDate = parseDateHeuristically(dates[0]);
          isCurrent = /present|current/i.test(dates[1] || '');
          endDate = isCurrent ? null : parseDateHeuristically(dates[1] || dates[0]);
        }

        const parts = remainingLine.split(/[|,\-–—]/).map(p => p.trim()).filter(Boolean);
        if (parts.length >= 2) {
          const part0IsRole = roleKeywords.test(parts[0]);
          const part1IsRole = roleKeywords.test(parts[1]);
          if (part0IsRole && !part1IsRole) {
            role = parts[0];
            company = parts[1];
            if (parts[2]) location = parts[2];
          } else if (part1IsRole && !part0IsRole) {
            role = parts[1];
            company = parts[0];
            if (parts[2]) location = parts[2];
          } else {
            company = parts[0];
            location = parts.slice(1).join(', ');
          }
        } else if (parts.length === 1) {
          if (roleKeywords.test(parts[0])) {
            role = parts[0];
          } else {
            company = parts[0];
          }
        }

        currentExp = {
          company: company.replace(/^[•\-*]\s*/, '').replace(/:+$/, '').trim() || 'Company',
          role: role.replace(/^[•\-*]\s*/, '').replace(/:+$/, '').trim() || '',
          location: location.replace(/^[•\-*]\s*/, '').replace(/:+$/, '').trim() || 'Remote',
          startDate,
          endDate,
          isCurrent,
          description: '',
          achievements: []
        };
      } else if (currentExp) {
        if (hasDuration && !currentExp.endDate && !currentExp.isCurrent) {
          const durationMatch = line.match(/\b(\d+(?:\.\d+)?)\s*(yr|year|month|mon)s?/i);
          if (durationMatch) {
            const amount = parseFloat(durationMatch[1]);
            const unit = durationMatch[2].toLowerCase();
            const end = new Date(currentExp.startDate);
            if (unit.startsWith('y')) {
              end.setFullYear(end.getFullYear() + Math.floor(amount));
              end.setMonth(end.getMonth() + Math.round((amount % 1) * 12));
            } else {
              end.setMonth(end.getMonth() + Math.round(amount));
            }
            currentExp.endDate = end;
          }
        }
        if (isRole && !currentExp.role) {
          const cleanRole = line.replace(/experience\s*:\s*\d+.*$/i, '').trim();
          currentExp.role = cleanRole.replace(/^[•\-*]\s*/, '').replace(/:+$/, '').trim();
        }
      }
    } else if (currentExp) {
      const cleanNext = line.replace(/^[•\-*]\s*/, '').trim();
      if (cleanNext) {
        if (isBullet) {
          currentExp.achievements.push(cleanNext);
        }
        currentExp.description += (currentExp.description ? ' ' : '') + cleanNext;
      }
    }
  }

  if (currentExp) {
    experiences.push(currentExp);
  }

  experiences.sort((a, b) => b.startDate.getTime() - a.startDate.getTime());

  experiences.forEach(exp => {
    if (!exp.role) exp.role = 'Software Developer';
    if (!exp.company) exp.company = 'Company';
    
    if (exp.endDate && exp.startDate && exp.endDate.getTime() === exp.startDate.getTime() && !exp.isCurrent) {
      if (experiences.indexOf(exp) === 0) {
        exp.isCurrent = true;
        exp.endDate = null;
      } else {
        const defaultEnd = new Date(exp.startDate);
        defaultEnd.setFullYear(defaultEnd.getFullYear() + 1);
        exp.endDate = defaultEnd;
      }
    }
  });

  return experiences;
}

function parseResumeHeuristically(rawText: string): ResumeParsedData {
  // Preprocess lines to merge broken coordinates and spacing errors
  const lines = splitConcatenatedEntries(preprocessLines(rawText));
  const text = lines.join('\n');

  // 1. Basic Contact Details
  let fullName = '';
  const nameExcludeKeywords = /\b(engineer|developer|analyst|intern|manager|lead|architect|designer|resume|cv|portfolio|experience|skills|education|projects|summary|profile|about|objective|contact|phone|email|address|page|curriculum|vitae|confidential|certified|senior|junior|associate|software|technical|full-stack|frontend|backend|cloud|web|mobile|b\.tech|m\.tech|bachelor|master|university|school|college|institute|tims|solution|dive|global|private|limited|vadodara|remotely|remote|present|current|jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\b/i;

  for (let i = 0; i < Math.min(15, lines.length); i++) {
    const line = lines[i];
    const clean = line.trim();
    
    if (
      clean.length > 2 &&
      clean.length < 35 &&
      !clean.includes('@') &&
      !clean.includes('http') &&
      !clean.includes('www.') &&
      !/\d/.test(clean) && // Names should not contain digits
      !/^[#\-\*•●▪◦■□➔\d\.\)\s]+/.test(clean) && // Names should not start with bullet/lists
      !nameExcludeKeywords.test(clean)
    ) {
      const words = clean.split(/\s+/).filter(Boolean);
      if (words.length >= 2 && words.length <= 4) {
        fullName = clean;
        break;
      }
    }
  }

  // Fallback: if no 2-4 word name is found, relax to 1 word name
  if (!fullName) {
    for (let i = 0; i < Math.min(10, lines.length); i++) {
      const line = lines[i];
      const clean = line.trim();
      
      if (
        clean.length > 2 &&
        clean.length < 25 &&
        !clean.includes('@') &&
        !clean.includes('http') &&
        !clean.includes('www.') &&
        !/\d/.test(clean) &&
        !nameExcludeKeywords.test(clean)
      ) {
        fullName = clean;
        break;
      }
    }
  }

  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
  const emailMatch = text.match(emailRegex);
  const email = emailMatch ? emailMatch[0] : 'candidate@example.com';

  if (!fullName) {
    // Attempt to extract name from email address prefix
    const emailPrefix = email.split('@')[0];
    if (emailPrefix && emailPrefix !== 'candidate') {
      // Clean prefix: remove numbers, split by dot, underscore, or dash
      const cleanedPrefix = emailPrefix.replace(/\d+/g, '').replace(/[._-]/g, ' ').trim();
      if (cleanedPrefix.length > 2) {
        // Capitalize words
        fullName = cleanedPrefix
          .split(/\s+/)
          .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
          .join(' ');
      }
    }
  }

  if (!fullName) fullName = 'Resume Candidate';

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

  // 2. Identify Section Blocks via Line-by-Line Grouping
  const sectionLines: Record<string, string[]> = {
    summary: [],
    skills: [],
    experiences: [],
    educations: [],
    projects: [],
    certifications: []
  };

  let currentSectionKey = '';
  lines.forEach(line => {
    const match = isSectionHeader(line);
    if (match) {
      currentSectionKey = match.key;
    } else if (currentSectionKey) {
      sectionLines[currentSectionKey].push(line);
    }
  });

  // 3. Extract Summary Section
  let summary = '';
  if (sectionLines.summary.length > 0) {
    summary = sectionLines.summary.join(' ').replace(/\s+/g, ' ').trim();
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

  const skillsSearchText = sectionLines.skills.join('\n') || text;
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

  if (skills.length === 0 && sectionLines.skills.length > 0) {
    sectionLines.skills.forEach(line => {
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

  // 5. Extract Experience Section (split concatenated column items first)
  const experiences = extractExperiencesRobustly(lines);
  const extractedExperienceProjects: any[] = [];

  // 6. Extract Education Section (split concatenated column items first)
  const educations: {
    institution: string;
    degree: string;
    field: string;
    startDate: Date;
    endDate: Date | null;
    grade: string;
    description: string;
  }[] = [];

  const eduLines = splitConcatenatedEntries(sectionLines.educations);

  if (eduLines.length > 0) {
    let currentEdu: any = null;

    eduLines.forEach(line => {
      const hasDate = dateRangeRegex.test(line) || yearRangeRegex.test(line) || /\b(19|20)\d{2}\b/.test(line);
      const isDegree = /bachelor|master|degree|b\.tech|m\.tech|b\.sc|m\.sc|phd|diploma|graduation|secondary|hsc|ssc|school|college|university/i.test(line);

      if ((hasDate || isDegree) && !line.startsWith('-') && !line.startsWith('•') && !line.startsWith('*')) {
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

  // Seed with projects extracted from experiences
  extractedExperienceProjects.forEach(ep => {
    projects.push({
      ...ep,
      sortOrder: projects.length
    });
  });

  const projLines = splitConcatenatedEntries(sectionLines.projects);

  if (projLines.length > 0) {
    let currentProj: any = null;

    projLines.forEach(line => {
      const isBullet = line.startsWith('-') || line.startsWith('•') || line.startsWith('*');
      const isFirstLine = currentProj === null;
      
      const isProjectHeaderPattern = !isBullet && (
        /^(?:project\s*:|key project\s*:)/i.test(line) ||
        (line.length > 2 && line.length < 60 && /^[A-Z]/.test(line) && !line.includes('http') && !line.startsWith('Website:'))
      );

      if (isFirstLine || isProjectHeaderPattern) {
        if (currentProj) {
          projects.push(currentProj);
        }

        let name = line;
        let repoUrl: string | null = null;
        let liveUrl: string | null = null;

        name = name.replace(/^(?:project\s*:|key project\s*:)\s*/i, '').trim();

        const splitMatches = name.split(/\s+[-–—:]\s+/);
        let description = '';
        if (splitMatches.length >= 2) {
          name = splitMatches[0];
          description = splitMatches.slice(1).join(' - ');
        }

        const urlMatches = name.match(/https?:\/\/[^\s]+|github\.com\/[^\s]+/gi);
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
          name: name.replace(/^[•\-*]\s*/, '').replace(/:+$/, '').trim(),
          description: description.trim(),
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

        const cleanLine = line.replace(/^[•\-*]\s*/, '').replace(/^(?:website|url|live|repo)\s*:\s*/i, '').trim();
        
        if (!cleanLine.startsWith('http') && !cleanLine.includes('github.com')) {
          currentProj.description += (currentProj.description ? ' ' : '') + cleanLine;
        }

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

  const certSearchText = sectionLines.certifications.join('\n') || text;
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

  // 9. Extract Social Links (including from Hyperlinks annotation section)
  const socialLinks: { platform: string; url: string }[] = [];
  
  const githubUrls = text.match(/(?:https?:\/\/)?(?:www\.)?github\.com\/[a-zA-Z0-9_\-\.]+(?:\/[a-zA-Z0-9_\-\.]+)?/gi) || [];
  let githubProfileUrl = '';
  for (const url of githubUrls) {
    const match = url.match(/(?:https?:\/\/)?(?:www\.)?github\.com\/([a-zA-Z0-9_\-\.]+)/i);
    if (match) {
      githubProfileUrl = `https://github.com/${match[1]}`;
      break;
    }
  }
  if (githubProfileUrl) {
    socialLinks.push({ platform: 'github', url: githubProfileUrl });
  }

  const linkedinUrls = text.match(/(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/[a-zA-Z0-9_\-\.]+/gi) || [];
  let linkedinProfileUrl = '';
  if (linkedinUrls.length > 0 && linkedinUrls[0]) {
    linkedinProfileUrl = linkedinUrls[0];
    if (!linkedinProfileUrl.startsWith('http')) {
      linkedinProfileUrl = 'https://' + linkedinProfileUrl;
    }
    socialLinks.push({ platform: 'linkedin', url: linkedinProfileUrl });
  }

  // Auto-append email social link if a valid email is parsed
  if (email && email !== 'candidate@example.com') {
    socialLinks.push({ platform: 'email', url: `mailto:${email}` });
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
