const rawText = `Kunal Gwala
+91 9680669095 | kunalgwala8696@gmail.com | LinkedIn | GitHub
- Worked on full-stack development projects using React.js and React Native. -
Collaborated in Agile sprints and integrated REST APIs for scalable applications. -
Contributed to UI improvements and performance optimization.
Project: Meta Machinery — WordPress Website
Website: https://mitamachinery.com/
- Developed and customized WordPress themes and layouts.
- Implemented responsive UI and plugin integrations.
Master Course in Web Framework (HTML, CSS, JavaScript) – Udemy (2023)
React.js Certification – Learntube (2023) RSCIT Certification – VMOU Kota (2022)
- Working as an Associate Software Developer building modern web and mobile applications using
React.js, React Native and TypeScript.
- Developing reusable UI components and contributing to production-level features.

Tibookk — Invoice & Billing Platform
Website: https://tibook.in/
- Built invoice creation, billing logic, and client management modules with modern UI using Metronic.
Kalory — AI Powered Nutrition App
Website: https://mykalory.com/
- Developed mobile-first nutrition tracking app using React Native.
- Implemented Google Fit and Apple Health sync functionality for health data integration.
- Built AI food recognition and analytics dashboard features.
Key Projects
B.Tech in Computer Science | Bikaner Technical University (CGPA: 8.1/10) | 2020 – 2024 Senior
Secondary | Shree Agrasen Sr. Sec. School | 2019 – 2020 Secondary | Shree Agrasen Sr. Sec. School |
2017 – 2018
Certifications

Doctor Appointment Booking Website - User authentication with secure login & registration. - Doctor
profiles with availability and time slot management. - Appointment booking & cancellation system. - Admin
panel to manage doctors, patients, and appointments. - Razorpay payment gateway integration. - Built
using React.js, Express.js, MongoDB, Tailwind CSS.
Education

Enthusiastic and innovative Full-Stack Developer with expertise in React.js, React Native (Expo), Node.js,
MongoDB, and WordPress. Passionate about building scalable and responsive web and mobile applications
with strong problem-solving skills and hands-on experience across frontend, backend, and full product
development cycles.

Frontend: React.js, React Native, Expo, Tailwind CSS, Bootstrap, Zustand, Redux, TypeScript Backend:
Node.js, Express.js CMS: WordPress Database: MongoDB, MongoDB Atlas Programming Languages: Core
Java, JavaScript, TypeScript Tools & Concepts: Git, GitHub, REST APIs, OOP, DBMS, Socket.io
Professional Experience
Core Skills
Professional Summary

AssociateSoftwareDeveloper—TIMSITSOLUTION(TIMS) | Vadodara | Sep2025–Present
SoftwareDeveloperIntern—Dive (OPC) Global Private Limited | Vadodar
a | Apr 2025 – Sep
2025`;

function parseDateHeuristically(dateStr) {
  const clean = dateStr.trim();
  const yearMatch = clean.match(/\b(19|20)\d{2}\b/);
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

function cleanSplitDates(text) {
  const monthYearOrPresent = '(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|[0-9]{4}|present|current)';
  
  // Replace: Month/Year \n Dash -> Month/Year Dash (supporting trailing spaces)
  let cleaned = text.replace(new RegExp(`(${monthYearOrPresent})[a-z]*\\.?\\s*\\r?\\n\\s*([-–—])`, 'gi'), '$1 $2');
  
  // Replace: Dash \n Month/Year/Present -> Dash Month/Year/Present
  cleaned = cleaned.replace(new RegExp(`([-–—])\\s*\\r?\\n\\s*(${monthYearOrPresent})`, 'gi'), '$1 $2');
  
  // Replace: Month \n Year -> Month Year (corrected to single backslashes in regex literal)
  cleaned = cleaned.replace(/\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\.?\s*\r?\\n\\s*([0-9]{4})\b/gi, '$1 $2');
  
  return cleaned;
}

function getSectionEndIndex(text, startIndex) {
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

function parseResumeHeuristically(rawText) {
  const text = cleanSplitDates(rawText);
  const lines = text.split('\n').map(line => line.trim()).filter(Boolean);
  
  let fullName = '';
  for (let i = 0; i < Math.min(5, lines.length); i++) {
    const line = lines[i];
    if (line.length > 2 && line.length < 40 && !line.includes('@') && !line.includes('http') && !/\d{5,}/.test(line)) {
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
  if (!location) {
    location = 'Remote';
  }

  const commonSkills = [
    'JavaScript', 'TypeScript', 'React', 'Angular', 'Vue', 'Node.js', 'Express',
    'NestJS', 'Python', 'Django', 'Flask', 'Java', 'Spring', 'C++', 'C#', '.NET',
    'Ruby', 'Rails', 'PHP', 'Laravel', 'SQL', 'PostgreSQL', 'MySQL', 'MongoDB',
    'Redis', 'AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'CI/CD', 'Git',
    'HTML', 'CSS', 'Tailwind', 'Sass', 'GraphQL', 'REST API', 'Agile', 'Scrum'
  ];
  
  const skills = [];
  commonSkills.forEach(skill => {
    const escaped = skill.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    const regex = new RegExp(`\\b${escaped}\\b`, 'i');
    if (regex.test(text)) {
      skills.push({
        name: skill,
        level: 'ADVANCED',
        category: 'Technical Skills'
      });
    }
  });

  const monthYearPattern = '(?:(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\\.?\\s*|\\b\\d{1,2}\\/\\s*)?(?:19|20)\\d{2}';
  const rangeRegex = new RegExp(`(${monthYearPattern})\\s*[-–—]\\s*(present|current|${monthYearPattern})`, 'i');

  const experiences = [];
  const experienceIndex = text.search(/(?:^|\r?\n)\s*(?:professional\s+|work\s+)?(?:experience|work history|employment history)/i);
  const educationIndex = text.search(/\r?\n\s*(?:education|academic)/i);
  const projectsIndex = text.search(/\r?\n\s*(?:projects|personal projects|key projects)/i);

  if (experienceIndex !== -1) {
    const expEnd = getSectionEndIndex(text, experienceIndex);
    const expText = text.slice(experienceIndex, expEnd);
    const expLines = expText.split('\n').map(l => l.trim()).filter(Boolean);
    
    let currentExp = null;
    expLines.forEach((line, idx) => {
      const dateMatch = line.match(rangeRegex);
      if (dateMatch) {
        // Enforce alphabetic count check to ignore year-only lines
        const alphaCount = (line.match(/[a-zA-Z]/g) || []).length;
        if (alphaCount < 5) return;

        if (currentExp) {
          experiences.push(currentExp);
        }
        
        let company = 'Company';
        let role = 'Software Engineer';
        
        let headerText = line;
        if (idx > 0 && !line.includes('—') && !line.toLowerCase().includes(' at ') && !line.includes(' - ') && expLines[idx - 1]) {
          headerText = expLines[idx - 1] + ' | ' + line;
        }

        const atMatch = headerText.match(/(.+)\s+at\s+(.+?)(?:\s*[\(\[].*[\)\]]|\s*[,|])/i);
        if (atMatch) {
          role = atMatch[1].trim();
          company = atMatch[2].trim();
        } else {
          const parts = headerText.split(/[—|]|\s+-\s+/);
          if (parts.length >= 2) {
            role = parts[0].trim();
            company = parts[1].trim();
          }
        }
        
        const dates = dateMatch[0].split(/[-–—]/).map(d => d.trim());
        const startDate = parseDateHeuristically(dates[0]);
        const isCurrent = /present/i.test(dates[1]);
        const endDate = isCurrent ? null : parseDateHeuristically(dates[1]);
        
        currentExp = {
          company,
          role,
          location: 'Remote',
          startDate: startDate,
          endDate: endDate,
          isCurrent,
          description: '',
          achievements: []
        };
      } else if (currentExp && (line.startsWith('•') || line.startsWith('-'))) {
        currentExp.achievements.push(line.replace(/^[•-]\s*/, ''));
      } else if (currentExp && currentExp.description.length < 200) {
        currentExp.description += (currentExp.description ? ' ' : '') + line;
      }
    });
    
    if (currentExp) {
      experiences.push(currentExp);
    }
  }

  // GLOBAL SCAN FALLBACK FOR EXPERIENCES
  if (experiences.length === 0) {
    const expLines = text.split('\n').map(l => l.trim()).filter(Boolean);
    let currentExp = null;
    expLines.forEach((line, idx) => {
      const dateMatch = line.match(rangeRegex);
      if (dateMatch) {
        // Enforce alphabetic count check to ignore year-only lines
        const alphaCount = (line.match(/[a-zA-Z]/g) || []).length;
        if (alphaCount < 5) return;

        const isEdu = line.toLowerCase().includes('university') || 
                      line.toLowerCase().includes('college') || 
                      line.toLowerCase().includes('school') || 
                      line.toLowerCase().includes('degree') || 
                      line.toLowerCase().includes('bachelor') || 
                      line.toLowerCase().includes('master') || 
                      line.toLowerCase().includes('secondary') ||
                      line.toLowerCase().includes('education');
        if (isEdu) return;

        if (currentExp) {
          experiences.push(currentExp);
        }
        
        let company = 'Company';
        let role = 'Software Engineer';
        
        let headerText = line;
        if (idx > 0 && !line.includes('—') && !line.toLowerCase().includes(' at ') && !line.includes(' - ') && expLines[idx - 1]) {
          headerText = expLines[idx - 1] + ' | ' + line;
        }

        const atMatch = headerText.match(/(.+)\s+at\s+(.+?)(?:\s*[\(\[].*[\)\]]|\s*[,|])/i);
        if (atMatch) {
          role = atMatch[1].trim();
          company = atMatch[2].trim();
        } else {
          const parts = headerText.split(/[—|]|\s+-\s+/);
          if (parts.length >= 2) {
            role = parts[0].trim();
            company = parts[1].trim();
          }
        }
        
        const dates = dateMatch[0].split(/[-–—]/).map(d => d.trim());
        const startDate = parseDateHeuristically(dates[0]);
        const isCurrent = /present/i.test(dates[1]);
        const endDate = isCurrent ? null : parseDateHeuristically(dates[1]);
        
        currentExp = {
          company,
          role,
          location: 'Remote',
          startDate: startDate,
          endDate: endDate,
          isCurrent,
          description: '',
          achievements: []
        };
      } else if (currentExp && (line.startsWith('•') || line.startsWith('-'))) {
        currentExp.achievements.push(line.replace(/^[•-]\s*/, ''));
      } else if (currentExp && currentExp.description.length < 200) {
        currentExp.description += (currentExp.description ? ' ' : '') + line;
      }
    });
    if (currentExp) {
      experiences.push(currentExp);
    }
  }

  const educations = [];
  if (educationIndex !== -1) {
    const eduEnd = getSectionEndIndex(text, educationIndex);
    const eduText = text.slice(educationIndex, eduEnd);
    const eduLines = eduText.split('\n').map(l => l.trim()).filter(Boolean);
    
    let currentEdu = null;
    eduLines.forEach(line => {
      const yearMatch = line.match(/\b(19|20)\d{2}\b/);
      const isEduLine = yearMatch && (
        line.toLowerCase().includes('university') || 
        line.toLowerCase().includes('college') || 
        line.toLowerCase().includes('school') || 
        line.toLowerCase().includes('degree') || 
        line.toLowerCase().includes('bachelor') || 
        line.toLowerCase().includes('master') || 
        line.toLowerCase().includes('b.s') || 
        line.toLowerCase().includes('m.s') || 
        line.toLowerCase().includes('btech') || 
        line.toLowerCase().includes('mtech') ||
        line.toLowerCase().includes('secondary')
      );
      
      if (isEduLine) {
        // Enforce alphabetic count check to ignore year-only lines
        const alphaCount = (line.match(/[a-zA-Z]/g) || []).length;
        if (alphaCount < 5) return;

        if (currentEdu) {
          educations.push(currentEdu);
        }
        
        let institution = 'University / College';
        let degree = 'Bachelor of Science';
        let field = 'Computer Science';
        
        const parts = line.split(/[|—–-]/).map(p => p.trim()).filter(Boolean);
        if (parts.length >= 2) {
          if (parts[0].toLowerCase().includes('university') || parts[0].toLowerCase().includes('college') || parts[0].toLowerCase().includes('school') || parts[0].toLowerCase().includes('institute')) {
            institution = parts[0];
            degree = parts[1];
          } else {
            degree = parts[0];
            institution = parts[1];
          }
          field = degree;
        } else {
          const uniMatch = line.match(/(?:at|from)?\s*([^,|-]*(?:university|college|institute|school|academy)[^,|-]*)/i);
          if (uniMatch) {
            institution = uniMatch[1].trim();
          }
          const degMatch = line.match(/(bachelor|master|b\.s|m\.s|b\.tech|m\.tech|phd|associate|diploma)\s*(?:of|in)?\s*([^,|-]*)/i);
          if (degMatch) {
            degree = degMatch[1].trim() + ' of ' + degMatch[2].trim();
            field = degMatch[2].trim();
          }
        }
        
        const year = parseInt(yearMatch[0]);
        const startDate = new Date(year - 4, 8, 1);
        const endDate = new Date(year, 4, 15);
        
        currentEdu = {
          institution,
          degree,
          field,
          startDate: startDate,
          endDate: endDate,
          grade: '',
          description: ''
        };
      }
    });
    
    if (currentEdu) {
      educations.push(currentEdu);
    }
  }

  // GLOBAL SCAN FALLBACK FOR EDUCATIONS
  if (educations.length === 0) {
    const eduLines = text.split('\n').map(l => l.trim()).filter(Boolean);
    let currentEdu = null;
    eduLines.forEach(line => {
      const yearMatch = line.match(/\b(19|20)\d{2}\b/);
      const isEduLine = yearMatch && (
        line.toLowerCase().includes('university') || 
        line.toLowerCase().includes('college') || 
        line.toLowerCase().includes('school') || 
        line.toLowerCase().includes('degree') || 
        line.toLowerCase().includes('bachelor') || 
        line.toLowerCase().includes('master') || 
        line.toLowerCase().includes('b.s') || 
        line.toLowerCase().includes('m.s') || 
        line.toLowerCase().includes('btech') || 
        line.toLowerCase().includes('mtech') ||
        line.toLowerCase().includes('secondary')
      );
      
      if (isEduLine) {
        // Enforce alphabetic count check to ignore year-only lines
        const alphaCount = (line.match(/[a-zA-Z]/g) || []).length;
        if (alphaCount < 5) return;

        if (currentEdu) {
          educations.push(currentEdu);
        }
        
        let institution = 'University / College';
        let degree = 'Bachelor of Science';
        let field = 'Computer Science';
        
        const parts = line.split(/[|—–-]/).map(p => p.trim()).filter(Boolean);
        if (parts.length >= 2) {
          if (parts[0].toLowerCase().includes('university') || parts[0].toLowerCase().includes('college') || parts[0].toLowerCase().includes('school') || parts[0].toLowerCase().includes('institute')) {
            institution = parts[0];
            degree = parts[1];
          } else {
            degree = parts[0];
            institution = parts[1];
          }
          field = degree;
        } else {
          const uniMatch = line.match(/(?:at|from)?\s*([^,|-]*(?:university|college|institute|school|academy)[^,|-]*)/i);
          if (uniMatch) {
            institution = uniMatch[1].trim();
          }
          const degMatch = line.match(/(bachelor|master|b\.s|m\.s|b\.tech|m\.tech|phd|associate|diploma)\s*(?:of|in)?\s*([^,|-]*)/i);
          if (degMatch) {
            degree = degMatch[1].trim() + ' of ' + degMatch[2].trim();
            field = degMatch[2].trim();
          }
        }
        
        const year = parseInt(yearMatch[0]);
        const startDate = new Date(year - 4, 8, 1);
        const endDate = new Date(year, 4, 15);
        
        currentEdu = {
          institution,
          degree,
          field,
          startDate: startDate,
          endDate: endDate,
          grade: '',
          description: ''
        };
      }
    });
    if (currentEdu) {
      educations.push(currentEdu);
    }
  }

  const projects = [];
  return {
    fullName,
    email,
    phone,
    location,
    skills,
    experiences,
    educations,
    projects
  };
}

console.log(JSON.stringify(parseResumeHeuristically(rawText), null, 2));
