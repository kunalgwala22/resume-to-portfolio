FROM node:20-alpine AS builder

WORKDIR /app

# Copy package configurations
COPY package.json package-lock.json turbo.json ./
COPY packages/shared/package.json ./packages/shared/
COPY frontend/package.json ./frontend/

# Install dependencies
RUN npm ci

# Copy sources
COPY packages/shared/ ./packages/shared/
COPY frontend/ ./frontend/

# Build shared package and frontend bundle
RUN npm run build --workspace=@portfolioverse/shared
RUN npm run build --workspace=frontend

# Nginx host stage
FROM nginx:alpine

# Copy built assets
COPY --from=builder /app/frontend/dist /usr/share/nginx/html

# Copy custom Nginx configuration
COPY frontend/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
