# --- STAGE 1: Build Stage ---
FROM node:20-slim AS builder

# Install system dependencies (openssl for Prisma, etc.)
RUN apt-get update -y && \
    apt-get install -y openssl python3 build-essential && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy root configurations
COPY package*.json ./
COPY tsconfig.base.json ./

# Copy everything (rest of the source)
# .dockerignore should handle node_modules and dist
COPY . .

# Install ALL dependencies (needed for building)
RUN npm install

# Build the shared project
RUN npm run build -w @kern/shared

# Build the specific service (passed as build arg)
ARG SERVICE_NAME
RUN if [ -f "./prisma/schema.prisma" ]; then npx prisma generate --schema=./prisma/schema.prisma; fi
RUN npm run build -w @kern/${SERVICE_NAME}

# --- STAGE 2: Production Stage ---
FROM node:20-slim AS runner

RUN apt-get update -y && \
    apt-get install -y openssl && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy root configurations and dependency files
COPY package*.json ./
COPY tsconfig.base.json ./
COPY packages/shared/package*.json ./packages/shared/

ARG SERVICE_NAME
COPY services/${SERVICE_NAME}/package*.json ./services/${SERVICE_NAME}/

# Install only production dependencies
RUN npm install --omit=dev --ignore-scripts && npm cache clean --force

# Copy generated Prisma engine if it exists
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma/client ./node_modules/@prisma/client

# Copy built code
COPY --from=builder /app/packages/shared/dist ./packages/shared/dist
COPY --from=builder /app/services/${SERVICE_NAME}/dist ./services/${SERVICE_NAME}/dist

# Copy all service openapi.yaml specs (only used by api-gateway at runtime)
COPY --from=builder /app/services/organizations-service/openapi.yaml ./services/organizations-service/openapi.yaml
COPY --from=builder /app/services/content-service/openapi.yaml ./services/content-service/openapi.yaml
COPY --from=builder /app/services/ai-service/openapi.yaml ./services/ai-service/openapi.yaml
COPY --from=builder /app/services/notifications-service/openapi.yaml ./services/notifications-service/openapi.yaml
COPY --from=builder /app/services/social-service/openapi.yaml ./services/social-service/openapi.yaml
COPY --from=builder /app/services/billing-service/openapi.yaml ./services/billing-service/openapi.yaml
COPY --from=builder /app/services/admin-service/openapi.yaml ./services/admin-service/openapi.yaml

# Metadata
ENV SERVICE_NAME=${SERVICE_NAME}
ENV NODE_ENV=production

# The port is dynamic per service, but container internal port is fixed or passed
ARG PORT=3000
EXPOSE ${PORT}

CMD ["sh", "-c", "node services/${SERVICE_NAME}/dist/main.js"]
