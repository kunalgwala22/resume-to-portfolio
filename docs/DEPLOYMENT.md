# Deployment & Operations Guide

This guide details instructions on launching **PortfolioVerse AI** both locally for development and in cloud production environments.

---

## 1. Quickstart: Docker Compose (Local Dev)

You can launch the entire stack (PostgreSQL, Redis, Express Backend, Vite Frontend) with a single command:

```bash
docker-compose up --build
```

### Services Mapping:
- **Frontend App**: `http://localhost` (Port 80)
- **Backend API**: `http://localhost:3001` (Port 3001)
- **Postgres Database**: `localhost:5432`
- **Redis Cache**: `localhost:6379`

To tear down containers and clear database volumes:
```bash
docker-compose down -v
```

---

## 2. Production Deployments (PaaS e.g. Render / Heroku / AWS)

When deploying to production, separate the concerns:

### Database (PostgreSQL)
1. Provision a managed PostgreSQL instance (e.g. AWS RDS, Supabase, Render PostgreSQL).
2. Grab the connection string. Make sure it supports connection pooling if using serverless executors.

### Cache & Limiter (Redis)
1. Provision a managed Redis cluster (e.g. AWS ElastiCache, Upstash Redis, Render Redis).
2. Configure `REDIS_URL` pointing to the connection URI.

### Backend Service (Express)
- **Build Command**: `npm run build --workspace=backend`
- **Start Command**: `npm run start --workspace=backend`
- **Required Environment Variables**:
  - `DATABASE_URL`: Connection string.
  - `REDIS_URL`: Redis connection string.
  - `JWT_SECRET`: Crypto key for HS256 tokens.
  - `REFRESH_TOKEN_SECRET`: Crypto key for refresh tokens.
  - `OPENAI_API_KEY`: OpenAI API key.
  - `CLOUDINARY_URL`: Cloudinary SDK credential.

To run migrations during deployment, hook this script before boot:
```bash
npx prisma db push --schema=backend/prisma/schema.prisma
```

### Frontend Service (Static SPA)
Vite projects generate pure static assets in `frontend/dist/`.
1. Deploy the contents of `frontend/dist/` to any CDN or Static Site Host (e.g. Netlify, Vercel, AWS S3 + CloudFront).
2. Configure rewrite rules mapping all wildcard paths to `/index.html` to prevent 404s when refreshing client-side routes.
   - For **Vercel**, use a `vercel.json` rewrite:
     ```json
     {
       "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
     }
     ```
   - For **Nginx**, see the provided `frontend/nginx.conf` routing fallback rules.
