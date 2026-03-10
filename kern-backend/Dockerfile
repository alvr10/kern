# Multi-stage Dockerfile for Development and Production
FROM node:24-alpine AS base
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install ALL dependencies (dev + prod) for building
FROM base AS deps-dev
COPY package.json package-lock.json* ./
RUN npm install

# Install ONLY production dependencies (clean, no prune needed)
FROM base AS deps-prod
COPY package.json package-lock.json* ./
RUN npm install --omit=dev

# Builder stage: Generate Prisma Client and compile TypeScript
FROM base AS builder
COPY --from=deps-dev /app/node_modules ./node_modules
COPY . .
# CRITICAL: Generate Prisma before building TypeScript
RUN npm run prisma:generate
RUN npm run build

# Development stage: For local development with watch mode
FROM base AS development
ENV NODE_ENV=development
COPY --from=deps-dev /app/node_modules ./node_modules
COPY . .
RUN npm run prisma:generate
EXPOSE 3000
CMD ["npm", "run", "start:dev"]

# Production stage: Final lean image for Fly.io
FROM node:24-alpine AS production
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000

# Copy production deps + build artifacts + prisma schema
COPY --from=deps-prod /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/healthcheck.js ./healthcheck.js

# Re-generate Prisma client against the production node_modules
RUN npx prisma generate

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD node healthcheck.js

CMD ["npm", "run", "start:prod"]