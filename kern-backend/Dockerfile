# =============================================================================
# STAGE 1: deps — Install ALL dependencies (dev included) for the build step.
#           We do this in isolation so the layer is cached until package*.json changes.
# =============================================================================
FROM node:22-slim AS deps

RUN apt-get update -y && \
    apt-get install -y --no-install-recommends openssl python3 build-essential && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY .npmrc ./
COPY package*.json ./
COPY packages/shared/package*.json ./packages/shared/

ARG SERVICE_NAME
COPY services/${SERVICE_NAME}/package*.json ./services/${SERVICE_NAME}/

# Full install (dev + prod) — needed to compile TypeScript.
RUN npm install \
      --fetch-retries=5 \
      --fetch-retry-mintimeout=10000 \
      --fetch-retry-maxtimeout=60000

# =============================================================================
# STAGE 2: builder — Compile TypeScript and generate Prisma client.
# =============================================================================
FROM deps AS builder

# Bring in the full source tree (node_modules already present from deps stage).
COPY tsconfig.base.json ./
COPY packages/shared/ ./packages/shared/
COPY services/${SERVICE_NAME}/ ./services/${SERVICE_NAME}/

# Copy the root Prisma schema if it exists (shared schema pattern).
COPY prisma/ ./prisma/

# Generate Prisma client only for services that declare @prisma/client as a dependency.
# The schema lives at the root (shared), but not every service uses Prisma.
RUN if [ -d "./node_modules/@prisma/client" ]; then \
      npx prisma generate --schema=./prisma/schema.prisma; \
    fi

# Build shared lib first, then the target service.
RUN npm run build -w @kern/shared
RUN npm run build -w @kern/${SERVICE_NAME}

# =============================================================================
# STAGE 3: prod-deps — Strip devDependencies without touching the network.
#           Copy node_modules from builder, then prune — pure filesystem, no registry.
# =============================================================================
FROM node:22-slim AS prod-deps

RUN apt-get update -y && \
    apt-get install -y --no-install-recommends openssl && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY .npmrc ./
COPY package*.json ./
COPY packages/shared/package*.json ./packages/shared/

ARG SERVICE_NAME
COPY services/${SERVICE_NAME}/package*.json ./services/${SERVICE_NAME}/

# Bring in the full node_modules from the builder (dev + prod).
COPY --from=builder /app/node_modules ./node_modules

# Prune devDependencies in-place — no network, no registry, just fs deletes.
RUN npm prune --omit=dev --ignore-scripts && npm cache clean --force

# =============================================================================
# STAGE 4: runner — Minimal production image.
# =============================================================================
FROM node:22-slim AS runner

RUN apt-get update -y && \
    apt-get install -y --no-install-recommends openssl && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

ARG SERVICE_NAME

# Production node_modules (no devDeps, no build tools).
COPY --from=prod-deps /app/node_modules ./node_modules

# Compiled output only — no source, no tsconfig, no test files.
COPY --from=builder /app/packages/shared/dist ./packages/shared/dist
COPY --from=builder /app/services/${SERVICE_NAME}/dist ./services/${SERVICE_NAME}/dist

# Copy this service's own openapi spec (present for every service that exposes one).
# The trailing wildcard makes the COPY a no-op when the file is absent.
COPY --from=builder /app/services/${SERVICE_NAME}/openapi.yaml* ./services/${SERVICE_NAME}/

# For the api-gateway only: it serves peer specs as static files at runtime.
# We copy them straight from the build context since each builder stage only
# contains a single service's source tree.
# Bracket-glob trick: `[l]` matches 'l' making it optional — no-op if file absent.
# mkdir ensures the destination dirs exist so the optional COPY doesn't error.
RUN mkdir -p \
      services/organizations-service \
      services/content-service \
      services/ai-service \
      services/notifications-service \
      services/social-service \
      services/billing-service \
      services/admin-service

COPY services/organizations-service/openapi.yam[l] ./services/organizations-service/
COPY services/content-service/openapi.yam[l] ./services/content-service/
COPY services/ai-service/openapi.yam[l] ./services/ai-service/
COPY services/notifications-service/openapi.yam[l] ./services/notifications-service/
COPY services/social-service/openapi.yam[l] ./services/social-service/
COPY services/billing-service/openapi.yam[l] ./services/billing-service/
COPY services/admin-service/openapi.yam[l] ./services/admin-service/

ENV NODE_ENV=production
ENV SERVICE_NAME=${SERVICE_NAME}

ARG PORT=3000
EXPOSE ${PORT}

# Run as non-root for security hardening.
USER node

CMD ["sh", "-c", "node services/${SERVICE_NAME}/dist/main.js"]
