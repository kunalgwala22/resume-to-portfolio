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
  return text.replace(/([-–—])\r?\n/g, '$1 ')
             .replace(/\r?\n([-–—])/g, ' $1')
             .replace(/\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\r?\n/gi, '$1 ')
             .replace(/\r?\n(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*/gi, ' $1')
             .replace(/\b((?:19|20)\d{2})\r?\n/g, '$1 ')
             .replace(/\r?\n((?:19|20)\d{2})\b/g, ' $1');
}

function getSectionEndIndex(text, startIndex) {
  const sections = [/\r?\n\s*(?:education|academic)/i, /\r?\n\s*(?:projects|personal projects|key projects)/i, /\r?\n\s*(?:certifications)/i, /\r?\n\s*(?:skills|core skills)/i];
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

  const locationRegex = /[A-Z][a-zA-Z\s.]+,\s[A-Z]{2}(?:\s\d{5})?/;
  const locationMatch = text.match(locationRegex);
  const location = locationMatch ? locationMatch[0] : 'Remote';

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

  const monthYearPattern = '(?:(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\\.?\\s+|\\b\\d{1,2}\\/\\s*)?(?:19|20)\\d{2}';
  const rangeRegex = new RegExp(`(${monthYearPattern})\\s*[-–—]\\s*(present|current|${monthYearPattern})`, 'i');

  const experiences = [];
  const experienceIndex = text.search(/\b(?:experience|work history|employment history)/i);
  const educationIndex = text.search(/\n\s*(?:education|academic)/i);
  const projectsIndex = text.search(/\n\s*(?:projects|personal projects|key projects)/i);

  if (experienceIndex !== -1) {
    const expEnd = getSectionEndIndex(text, experienceIndex);
    const expText = text.slice(experienceIndex, expEnd);
    const expLines = expText.split('\n').map(l => l.trim()).filter(Boolean);
    
    let currentExp = null;
    expLines.forEach((line, idx) => {
      const dateMatch = line.match(rangeRegex);
      if (dateMatch) {
        if (currentExp) {
          experiences.push(currentExp);
        }
        
        let company = 'Company';
        let role = 'Software Engineer';
        
        let headerText = line;
        // If the date line doesn't contain a typical job title separator, look at the previous line
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
      if (yearMatch && (line.toLowerCase().includes('university') || line.toLowerCase().includes('college') || line.toLowerCase().includes('school') || line.toLowerCase().includes('degree') || line.toLowerCase().includes('bachelor') || line.toLowerCase().includes('master') || line.toLowerCase().includes('b.s') || line.toLowerCase().includes('m.s') || line.toLowerCase().includes('btech') || line.toLowerCase().includes('mtech'))) {
        if (currentEdu) {
          educations.push(currentEdu);
        }
        
        let institution = 'University / College';
        let degree = 'Bachelor of Science';
        let field = 'Computer Science';
        
        const uniMatch = line.match(/(?:at|from)?\s*([^,|-]*university[^,|-]*|[^,|-]*college[^,|-]*|[^,|-]*institute[^,|-]*)/i);
        if (uniMatch) {
          institution = uniMatch[1].trim();
        }
        
        const degMatch = line.match(/(bachelor|master|b\.s|m\.s|b\.tech|m\.tech|phd|associate|diploma)\s*(?:of|in)?\s*([^,|-]*)/i);
        if (degMatch) {
          degree = degMatch[1].trim() + ' of ' + degMatch[2].trim();
          field = degMatch[2].trim();
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
  if (projectsIndex !== -1) {
    const projEnd = getSectionEndIndex(text, projectsIndex);
    const projText = text.slice(projectsIndex, projEnd);
    const projLines = projText.split('\n').map(l => l.trim()).filter(Boolean);
    
    let currentProj = null;
    projLines.forEach(line => {
      // Check if line contains a project header
      if (line.length > 3 && line.length < 50 && !line.includes('@') && !line.toLowerCase().includes('experience') && !line.toLowerCase().includes('education') && (line.includes('http') || /^[A-Z][a-zA-Z0-9\s—–-]{2,40}$/.test(line))) {
        if (currentProj) {
          projects.push(currentProj);
        }
        
        const name = line.split(/[-(:|]/)[0].trim();
        let repoUrl = null;
        let liveUrl = null;
        
        const urlMatch = line.match(/https?:\/\/[^\s]+/g);
        if (urlMatch) {
          repoUrl = urlMatch[0];
          if (urlMatch[1]) liveUrl = urlMatch[1];
        }
        
        currentProj = {
          name,
          description: '',
          techStack: [],
          liveUrl,
          repoUrl
        };
      } else if (currentProj) {
        if (line.startsWith('•') || line.startsWith('-')) {
          currentProj.description += (currentProj.description ? ' ' : '') + line.replace(/^[•-]\s*/, '');
        } else if (currentProj.description.length < 300) {
          currentProj.description += (currentProj.description ? ' ' : '') + line;
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

const rawText = `Kunal Gwala
+91 9680669095 | kunalgwala02@gmail.com | LinkedIn | GitHub
Professional Summary
Enthusiastic and innovative Full-Stack Developer with expertise in React.js, React Native (Expo), Node.js, MongoDB, and WordPress. Passionate about building scalable and responsive web and mobile applications with strong problem-solving skills and hands-on experience across frontend, backend, and full product development cycles.
Core Skills
Frontend: React.js, React Native, Expo, Tailwind CSS, Bootstrap, Zustand, Redux, TypeScript
Backend: Node.js, Express.js
CMS: WordPress
Database: MongoDB, MongoDB Atlas
Programming Languages: Core Java, JavaScript, TypeScript
Tools & Concepts: Git, GitHub, REST APIs, OOP, DBMS, Socket.io
Professional Experience
Software Developer Intern — Dive (OPC) Global Private Limited | Vadodara | Apr 2025 –
Sep 2025
- Worked on full-stack development projects using React.js and React Native.
- Collaborated in Agile sprints and integrated REST APIs for scalable applications.
- Contributed to UI improvements and performance optimization.
Project: Meta Machinery — WordPress Website
Website: https://mitamachinery.com/
- Developed and customized WordPress themes and layouts.
- Implemented responsive UI and plugin integrations.
Associate Software Developer — TIMSIT SOLUTION (TIMS) | Vadodara | Sep 2025 – Present
- Working as an Associate Software Developer building modern web and mobile applications using React.js, React Native and TypeScript.
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
Doctor Appointment Booking Website
- User authentication with secure login & registration.
- Doctor profiles with availability and time slot management.
- Appointment booking & cancellation system.
- Admin panel to manage doctors, patients, and appointments.
- Razorpay payment gateway integration.
- Built using React.js, Express.js, MongoDB, Tailwind CSS.
Obstacle Avoidance & Line Following Robot
- Arduino-based robotic vehicle capable of autonomous navigation.
- IR sensors for line following and obstacle detection.
- Embedded C logic for real-time decision-making.
Education

B.Tech in Computer Science | Bikaner Technical University (CGPA: 8.1/10) | 2020 – 2024
Senior Secondary | Shree Agrasen Sr. Sec. School | 2019 – 2020
Secondary | Shree Agrasen Sr. Sec. School | 2017 – 2018
Certifications
Master Course in Web Framework (HTML, CSS, JavaScript) – Udemy (2023)

React.js Certification – Learntube (2023)
RSCIT Certification – VMOU Kota (2022)
`;

console.log(JSON.stringify(parseResumeHeuristically(rawText), null, 2));
