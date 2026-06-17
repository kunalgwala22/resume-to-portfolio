FROM node:20-alpine AS builder

WORKDIR /app

# Copy monorepo configuration files
COPY package.json package-lock.json turbo.json ./
COPY packages/shared/package.json ./packages/shared/
COPY backend/package.json ./backend/

# Install all dependencies (including devDependencies to compile TS)
RUN npm ci

# Copy sources
COPY packages/shared/ ./packages/shared/
COPY backend/ ./backend/

# Build shared package and compile backend Typescript
RUN npm run build --workspace=@portfolioverse/shared
RUN npm run build --workspace=backend

# Runner stage
FROM node:20-alpine AS runner

WORKDIR /app

# Copy production artifacts
COPY --from=builder /app /app

EXPOSE 3001

ENV NODE_ENV=production

CMD ["npm", "run", "start", "--workspace=backend"]
