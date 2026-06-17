import { PrismaClient, SkillLevel } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const TEMPLATES = [
  {
    id: "tmpl-clean-starter",
    slug: "clean-starter",
    name: "Clean Starter",
    description: "Clean, professional portfolio with a minimal modern design. Free to generate — no credits needed!",
    previewUrl: "/templates/previews/clean-starter.png",
    tags: ["Minimalist", "Clean", "Light", "Single Column"],
    category: "minimal",
    isPremium: false,
    themeColors: ["#7C3AED", "#10B981", "#EF4444", "#3B82F6"],
    features: ["Clean Design", "Responsive", "Smooth Animations"],
    sortOrder: 1,
  },
  {
    id: "tmpl-modern-developer",
    slug: "modern-developer",
    name: "Modern Developer",
    description: "Dark sidebar and code-editor-inspired content area. Ideal for Software Engineers and Tech Lead portfolios.",
    previewUrl: "/templates/previews/modern-developer.png",
    tags: ["Dark Mode", "Developer", "Sidebar", "Tech-themed"],
    category: "tech",
    isPremium: false,
    themeColors: ["#06B6D4", "#7C3AED", "#10B981", "#F59E0B"],
    features: ["Code Syntax Highlighting Style", "Left-Hand Sticky Navigation", "Detailed Tech Stack Tags"],
    sortOrder: 2,
  },
  {
    id: "tmpl-apple-style",
    slug: "apple-style",
    name: "Apple Style",
    description: "Full-bleed sections, SF Pro typography, and slick high-end aesthetic inspired by Apple's product design.",
    previewUrl: "/templates/previews/apple-style.png",
    tags: ["Minimalist", "Sleek", "Bold Text", "Full-bleed"],
    category: "design",
    isPremium: true,
    themeColors: ["#111111", "#7C3AED", "#6B7280", "#3B82F6"],
    features: ["Interactive Scroll Reveal", "Premium Product Cards", "Ultra-Clean Headers"],
    sortOrder: 3,
  },
  {
    id: "tmpl-linear-style",
    slug: "linear-style",
    name: "Linear Style",
    description: "Ultra-minimal dark mode layout using JetBrains Mono. Modeled after Linear's developer tool layout.",
    previewUrl: "/templates/previews/linear-style.png",
    tags: ["Dark Mode", "Monospace", "Productivity", "Subtle Border"],
    category: "tech",
    isPremium: true,
    themeColors: ["#5E6AD2", "#06B6D4", "#F59E0B", "#10B981"],
    features: ["Grid Layout Lines", "Subtle Keyboard Action Badges", "Custom Task List Styles"],
    sortOrder: 4,
  },
  {
    id: "tmpl-saas-dashboard",
    slug: "saas-dashboard",
    name: "SaaS Dashboard",
    description: "Card-based dashboard layout presenting sections like modules. Data-forward style.",
    previewUrl: "/templates/previews/saas-dashboard.png",
    tags: ["Dashboard", "Grid Layout", "Analytics Look", "Tailwind Theme"],
    category: "business",
    isPremium: false,
    themeColors: ["#2563EB", "#7C3AED", "#059669", "#D97706"],
    features: ["Visual Status Flags", "Collapsible Project Summary Blocks", "Metrics Summary Board"],
    sortOrder: 5,
  },
  {
    id: "tmpl-glass-universe",
    slug: "glass-universe",
    name: "Glass Universe",
    description: "Glassmorphism styling, frosted glass cards, and blurred interactive gradient orbs floating in back.",
    previewUrl: "/templates/previews/glass-universe.png",
    tags: ["Glassmorphism", "Fluid Gradients", "Vibrant", "Modern UI"],
    category: "creative",
    isPremium: true,
    themeColors: ["#EC4899", "#8B5CF6", "#3B82F6", "#10B981"],
    features: ["Frosted Backdrop Blur Layers", "Dynamic Floating Background Shapes", "Glow Borders"],
    sortOrder: 6,
  },
  {
    id: "tmpl-cyberpunk",
    slug: "cyberpunk",
    name: "Cyberpunk 2077",
    description: "High-contrast neon green/cyan/magenta grid lines, digital terminals, glow accents and raw industrial style.",
    previewUrl: "/templates/previews/cyberpunk.png",
    tags: ["Cyberpunk", "Terminal", "Neon", "Glow Effects"],
    category: "creative",
    isPremium: true,
    themeColors: ["#FACC15", "#06B6D4", "#EC4899", "#10B981"],
    features: ["Neon Text Glow Animation", "Terminal Command Simulation Headers", "Glitch Hover Triggers"],
    sortOrder: 7,
  },
  {
    id: "tmpl-orbit-os",
    slug: "orbit-os",
    name: "Orbit OS",
    description: "Interplanetary style showing dynamic orbiting constellation nodes, SVG paths, and cosmic theme lines.",
    previewUrl: "/templates/previews/orbit-os.png",
    tags: ["Space", "Constellations", "Interactive SVG", "Stellar"],
    category: "creative",
    isPremium: false,
    themeColors: ["#6366F1", "#EC4899", "#F59E0B", "#10B981"],
    features: ["Constellation Node Connectors", "Orbital SVG Ring Integrations", "Interactive Star Field"],
    sortOrder: 8,
  },
  {
    id: "tmpl-stellar-odyssey",
    slug: "stellar-odyssey",
    name: "Stellar Odyssey",
    description: "Deep navy and gold accents, featuring constellation stars, galaxy backgrounds, and premium typography.",
    previewUrl: "/templates/previews/stellar-odyssey.png",
    tags: ["Dark Mode", "Navy", "Gold Accents", "Astronomical"],
    category: "design",
    isPremium: true,
    themeColors: ["#D4AF37", "#6366F1", "#06B6D4", "#EC4899"],
    features: ["Elegant Astronomy Accents", "Fine Golden Divider Accents", "Smooth Section Fades"],
    sortOrder: 9,
  },
  {
    id: "tmpl-ai-digital-twin",
    slug: "ai-digital-twin",
    name: "AI Digital Twin",
    description: "Advanced futuristic identity layout with particle HUD layouts, neural grids, and AI-forward accents.",
    previewUrl: "/templates/previews/ai-digital-twin.png",
    tags: ["AI", "HUD Layout", "Neural Net", "Futuristic"],
    category: "tech",
    isPremium: true,
    themeColors: ["#10B981", "#3B82F6", "#8B5CF6", "#F59E0B"],
    features: ["Futuristic Particle Grid", "Neural Node Network Visuals", "Live System Monitor Dashboard Style"],
    sortOrder: 10,
  },
  {
    id: "tmpl-ink-corridor",
    slug: "ink-corridor",
    name: "The Corridor",
    description: "Hand-drawn gallery walkthrough — an ink-on-paper 3D corridor you walk down as you scroll. Projects hang in sketched picture frames, sections are 'rooms', with wobbly hand-drawn cards, masking tape, polaroids, and hand-written annotations.",
    previewUrl: "/templates/previews/ink-corridor.png",
    tags: ["3D", "Hand-Drawn", "Creative", "Interactive"],
    category: "creative",
    isPremium: true,
    themeColors: ["#1E1E1E", "#3A3A3A", "#5A5A5A", "#7A7A7A"],
    features: ["Ink-Line 3D Corridor", "Gallery Picture Frames", "Hand-Drawn Cards", "Polaroid About", "Guestbook Contact"],
    sortOrder: 11,
  },
];

async function main() {
  console.log('Seeding templates...');
  for (const t of TEMPLATES) {
    await prisma.template.upsert({
      where: { slug: t.slug },
      update: {
        name: t.name,
        description: t.description,
        previewUrl: t.previewUrl,
        tags: t.tags,
        category: t.category,
        isPremium: t.isPremium,
        themeColors: t.themeColors,
        features: t.features,
        sortOrder: t.sortOrder,
      },
      create: {
        id: t.id,
        slug: t.slug,
        name: t.name,
        description: t.description,
        previewUrl: t.previewUrl,
        tags: t.tags,
        category: t.category,
        isPremium: t.isPremium,
        themeColors: t.themeColors,
        features: t.features,
        sortOrder: t.sortOrder,
      },
    });
  }

  console.log('Creating demo user...');
  const passwordHash = await bcrypt.hash('Password123!', 10);
  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@portfolioverse.ai' },
    update: {},
    create: {
      email: 'demo@portfolioverse.ai',
      username: 'johndoe',
      passwordHash,
      fullName: 'John Doe',
      avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&h=400&fit=crop',
      bio: 'Full Stack Engineer specializing in TypeScript, Node.js, and React.',
      isEmailVerified: true,
    },
  });

  console.log('Cleaning up existing demo user data...');
  await prisma.portfolioView.deleteMany({ where: { userId: demoUser.id } });
  await prisma.portfolio.deleteMany({ where: { userId: demoUser.id } });
  await prisma.resume.deleteMany({ where: { userId: demoUser.id } });

  console.log('Creating demo resume...');
  const parsedData = {
    fullName: 'John Doe',
    email: 'demo@portfolioverse.ai',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    summary: 'Innovative Full Stack Engineer with 5+ years of experience building scalable web applications and distributed systems. Passionate about AI, developer tools, and user experience.',
    skills: [
      { name: 'TypeScript', level: 'EXPERT', category: 'Languages' },
      { name: 'Node.js', level: 'EXPERT', category: 'Backend' },
      { name: 'React', level: 'EXPERT', category: 'Frontend' },
      { name: 'PostgreSQL', level: 'ADVANCED', category: 'Database' },
      { name: 'Docker', level: 'ADVANCED', category: 'DevOps' },
      { name: 'OpenAI SDK', level: 'INTERMEDIATE', category: 'AI/ML' }
    ],
    experiences: [
      {
        company: 'TechCorp Solutions',
        role: 'Senior Software Engineer',
        location: 'San Francisco, CA',
        startDate: '2022-03-01T00:00:00.000Z',
        isCurrent: true,
        description: 'Lead developer for Core SaaS platforms.',
        achievements: [
          'Architected serverless API handling 10M+ daily requests, improving throughput by 40%.',
          'Mentored 6 junior engineers and introduced automated testing, raising line coverage to 90%.'
        ]
      },
      {
        company: 'StartupLabs',
        role: 'Full Stack Developer',
        location: 'Remote',
        startDate: '2020-01-15T00:00:00.000Z',
        endDate: '2022-02-28T00:00:00.000Z',
        isCurrent: false,
        description: 'Built customer onboarding funnel and payment integrations.',
        achievements: [
          'Redesigned checkout page using React and Stripe, increasing conversion rates by 18%.',
          'Migrated legacy database to PostgreSQL with zero downtime.'
        ]
      }
    ],
    educations: [
      {
        institution: 'University of California, Berkeley',
        degree: 'Bachelor of Science',
        field: 'Computer Science',
        startDate: '2016-09-01T00:00:00.000Z',
        endDate: '2020-05-15T00:00:00.000Z',
        grade: '3.8 GPA'
      }
    ],
    projects: [
      {
        name: 'TaskFlow AI',
        description: 'An AI-powered project management tool that auto-prioritizes tasks using GPT-4.',
        techStack: ['React', 'Node.js', 'PostgreSQL', 'OpenAI'],
        liveUrl: 'https://taskflow.ai',
        repoUrl: 'https://github.com/johndoe/taskflow-ai',
        isFeatured: true,
        sortOrder: 1
      },
      {
        name: 'Glow UI',
        description: 'A component library featuring frosted-glass elements and tailwind customization.',
        techStack: ['React', 'Tailwind CSS', 'Framer Motion'],
        liveUrl: 'https://glowui.dev',
        repoUrl: 'https://github.com/johndoe/glow-ui',
        isFeatured: false,
        sortOrder: 2
      }
    ],
    certifications: [
      {
        name: 'AWS Certified Solutions Architect',
        issuer: 'Amazon Web Services',
        issueDate: '2023-05-10T00:00:00.000Z',
        credentialId: 'AWS-ASA-998'
      }
    ],
    socialLinks: [
      { platform: 'github', url: 'https://github.com/johndoe' },
      { platform: 'linkedin', url: 'https://linkedin.com/in/johndoe' },
      { platform: 'twitter', url: 'https://twitter.com/johndoe' }
    ]
  };

  const demoResume = await prisma.resume.create({
    data: {
      userId: demoUser.id,
      originalName: 'john_doe_resume.pdf',
      fileUrl: 'https://res.cloudinary.com/demo/image/upload/v12345/resume.pdf',
      fileType: 'pdf',
      parseStatus: 'COMPLETED',
      parsedData,
      isActive: true,
      skills: {
        create: parsedData.skills.map(s => ({
          name: s.name,
          level: s.level as SkillLevel,
          category: s.category
        }))
      },
      experiences: {
        create: parsedData.experiences.map(e => ({
          company: e.company,
          role: e.role,
          location: e.location,
          startDate: new Date(e.startDate),
          endDate: e.endDate ? new Date(e.endDate) : null,
          isCurrent: e.isCurrent,
          description: e.description,
          achievements: e.achievements
        }))
      },
      educations: {
        create: parsedData.educations.map(ed => ({
          institution: ed.institution,
          degree: ed.degree,
          field: ed.field,
          startDate: new Date(ed.startDate),
          endDate: ed.endDate ? new Date(ed.endDate) : null,
          grade: ed.grade
        }))
      },
      projects: {
        create: parsedData.projects.map(p => ({
          name: p.name,
          description: p.description,
          techStack: p.techStack,
          liveUrl: p.liveUrl,
          repoUrl: p.repoUrl,
          isFeatured: p.isFeatured,
          sortOrder: p.sortOrder
        }))
      },
      certifications: {
        create: parsedData.certifications.map(c => ({
          name: c.name,
          issuer: c.issuer,
          issueDate: new Date(c.issueDate),
          credentialId: c.credentialId
        }))
      },
      socialLinks: {
        create: parsedData.socialLinks.map(s => ({
          platform: s.platform,
          url: s.url
        }))
      }
    }
  });

  console.log('Creating demo portfolio...');
  await prisma.portfolio.create({
    data: {
      userId: demoUser.id,
      templateId: 'tmpl-modern-developer',
      title: "John Doe | Senior Full Stack Engineer",
      headline: "Crafting High-Performance Distributed Systems & UI Experiences",
      summary: parsedData.summary,
      isPublished: true,
      seoTitle: "John Doe - Senior Full Stack Engineer Portfolio",
      seoDescription: "Explore John Doe's resume, tech stack, certifications and latest projects built with React, Node.js, and OpenAI.",
      themeColor: "#06B6D4"
    }
  });

  console.log('Creating mock analytics views...');
  const devices = ['desktop', 'mobile', 'tablet'];
  const browsers = ['Chrome', 'Safari', 'Firefox', 'Edge'];
  const countries = ['United States', 'Canada', 'United Kingdom', 'Germany', 'India'];
  const cities = ['San Francisco', 'Toronto', 'London', 'Berlin', 'Bangalore'];

  for (let i = 0; i < 30; i++) {
    const randomIdx = Math.floor(Math.random() * 5);
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 14));
    
    await prisma.portfolioView.create({
      data: {
        userId: demoUser.id,
        ip: `192.168.1.${10 + i}`,
        country: countries[randomIdx % countries.length],
        city: cities[randomIdx % cities.length],
        device: devices[randomIdx % devices.length],
        browser: browsers[randomIdx % browsers.length],
        referer: 'https://github.com',
        timeSpent: Math.floor(Math.random() * 300) + 15,
        createdAt: date
      }
    });
  }

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
