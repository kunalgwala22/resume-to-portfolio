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

function parseResumeHeuristically(text) {
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

  const experiences = [];
  const experienceIndex = text.search(/experience|work history|employment history/i);
  const educationIndex = text.search(/education|academic/i);
  const projectsIndex = text.search(/projects|personal projects/i);

  if (experienceIndex !== -1) {
    const expText = text.slice(experienceIndex, educationIndex !== -1 && educationIndex > experienceIndex ? educationIndex : undefined);
    const expLines = expText.split('\n').map(l => l.trim()).filter(Boolean);
    
    let currentExp = null;
    expLines.forEach(line => {
      const dateMatch = line.match(/(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|\b\d{1,2}\/)?\d{4}\s*[-–—]\s*(?:present|(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|\b\d{1,2}\/)?\d{4})/i);
      if (dateMatch) {
        if (currentExp) {
          experiences.push(currentExp);
        }
        
        let company = 'Company';
        let role = 'Software Engineer';
        
        const atMatch = line.match(/(.+)\s+at\s+(.+?)(?:\s*[\(\[].*[\)\]]|\s*[,|])/i);
        if (atMatch) {
          role = atMatch[1].trim();
          company = atMatch[2].trim();
        } else {
          const parts = line.split(/[–—,-|]/);
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
    const eduText = text.slice(educationIndex, projectsIndex !== -1 && projectsIndex > educationIndex ? projectsIndex : undefined);
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
    const projText = text.slice(projectsIndex);
    const projLines = projText.split('\n').map(l => l.trim()).filter(Boolean);
    
    let currentProj = null;
    projLines.forEach(line => {
      if (line.length > 3 && line.length < 30 && !line.includes('@') && (line.includes('http') || /^[A-Z][a-zA-Z0-9\s]{2,20}$/.test(line))) {
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

  let summary = '';
  const summaryIndex = text.search(/summary|profile|about me|objective/i);
  if (summaryIndex !== -1) {
    const sumText = text.slice(summaryIndex + 8, summaryIndex + 400);
    summary = sumText.split('\n').slice(0, 4).join(' ').trim();
  }
  if (!summary || summary.length < 30) {
    summary = `Experienced professional specializing in software development. Skilled at designing robust applications, collaborating with teams, and implementing scalable technologies.`;
  }

  if (experiences.length === 0) {
    experiences.push({
      company: 'Lead Developer / Engineer',
      role: 'Full Stack Engineer',
      location: 'Remote',
      startDate: new Date(Date.now() - 3 * 365 * 24 * 60 * 60 * 1000),
      endDate: null,
      isCurrent: true,
      description: 'Worked on building scalable features and modern user interfaces.',
      achievements: ['Designed key platform architecture.', 'Implemented automated testing pipelines.']
    });
  }

  if (educations.length === 0) {
    educations.push({
      institution: 'Degree College / University',
      degree: 'Bachelor of Science / Technology',
      field: 'Computer Science & Engineering',
      startDate: new Date(Date.now() - 7 * 365 * 24 * 60 * 60 * 1000),
      endDate: new Date(Date.now() - 3 * 365 * 24 * 60 * 60 * 1000),
      grade: 'First Class',
      description: 'Acquired foundational skills in software design and algorithms.'
    });
  }

  return {
    fullName,
    email,
    phone,
    location,
    summary,
    skills: skills.slice(0, 10),
    experiences,
    educations,
    projects,
    certifications: [],
    socialLinks: []
  };
}

const text = `Kunal Gwala
kunalgwala02@gmail.com
+91 9680669095
Enthusiastic and innovative Full-Stack Developer with expertise in React.js, React Native (Expo), Node.js, MongoDB, and WordPress.

Experience
Software Engineer at Google (2021 - Present)
- Worked on React and Node apps.

Education
UC Berkeley
Bachelor of Computer Science (2020)
`;

console.log(JSON.stringify(parseResumeHeuristically(text), null, 2));
