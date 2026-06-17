# PortfolioVerse AI

Production-Grade SaaS for extracting resumes (PDF/DOCX) using OpenAI, auto-generating premium responsive portfolios (10 layouts), and providing a Recruiter AI Chat assistant with page analytics tracking.

---

## Workspace Structure

The project is structured as an **npm workspaces monorepo** managed with **Turborepo**:

```
├── packages/
│   └── shared/          # Data schemas (Zod), types, templates metadata
├── backend/             # Express 5, Prisma ORM, Redis, OpenAI, Cloudinary
├── frontend/            # React 19, Vite, Tailwind CSS, Zustand, Recharts
├── docs/                # API, ERD, and Deployment manuals
└── docker-compose.yml   # Multi-container local operations orchestrator
```

---

## Key Tech Features
- **OpenAI GPT-4o Resume Parser**: Auto-extracts details from uploads into unified profiles.
- **10 Premium Designs**: Dynamic CSS-tailored layouts (Apple style, Cyberpunk neon, Glassmorphism, Orbit constallations SVG).
- **Recruiter Chatbot**: Candidate digital twin answering interviewer questions.
- **Detailed Analytics**: Device breakdown percentages, page-view time series graphs, geo-location IP matching.
- **Rotated Refresh Auth**: HTTPOnly cookies secure session handling.

---

## Developer Commands

Ensure you have Node.js 20+ installed.

### Install All Workspace Dependencies
```bash
npm install
```

### Start Development Mode (Backend & Frontend)
```bash
npm run dev
```

### Build All Workspaces
```bash
npm run build
```

### Run Quality Linting and Tests
```bash
npm run test
```

---

## Detailed Documentation Manuals
- [API Routing Directory](file:///media/kunal/Kunal1/hack2skill/resume2portfolio/docs/API.md)
- [Database Schema ERD](file:///media/kunal/Kunal1/hack2skill/resume2portfolio/docs/ERD.md)
- [Production Deployment Guide](file:///media/kunal/Kunal1/hack2skill/resume2portfolio/docs/DEPLOYMENT.md)
