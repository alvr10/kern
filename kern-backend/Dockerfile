# =============================================================================
# STAGE 1: deps — Full install for all packages to build the dependency graph.
# =============================================================================
FROM node:22-slim AS deps

ENV CI=true

RUN apt-get update -y && \
    apt-get install -y --no-install-recommends openssl python3 build-essential && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

COPY .npmrc ./
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/shared/package.json ./packages/shared/
COPY services/api-gateway/package.json ./services/api-gateway/
COPY services/organizations-service/package.json ./services/organizations-service/
COPY services/content-service/package.json ./services/content-service/
COPY services/social-service/package.json ./services/social-service/
COPY services/ai-service/package.json ./services/ai-service/
COPY services/billing-service/package.json ./services/billing-service/
COPY services/notifications-service/package.json ./services/notifications-service/
COPY services/admin-service/package.json ./services/admin-service/

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

# =============================================================================
# STAGE 2: builder — Compile TypeScript
# =============================================================================
FROM deps AS builder

ARG SERVICE_NAME

COPY tsconfig.base.json ./
COPY packages/shared/ ./packages/shared/
COPY services/${SERVICE_NAME}/ ./services/${SERVICE_NAME}/
COPY prisma/ ./prisma/

# Generate Prisma client in the builder so TypeScript has access to the generated types.
RUN if grep -q '"@prisma/client"' "./services/${SERVICE_NAME}/package.json"; then \
      npx prisma generate --schema=./prisma/schema.prisma; \
    fi

RUN pnpm --filter @kern/shared build
RUN pnpm --filter @kern/${SERVICE_NAME} build

# =============================================================================
# STAGE 3: deployer — Extract service and generate production Prisma client
# =============================================================================
FROM builder AS deployer

# Force a flat node_modules for the deployed output if the service uses Prisma.
# The isolated (symlink) linker causes @prisma/client to resolve from inside
# .pnpm/... where it cannot find the generated .prisma/client folder.
RUN if grep -q '"@prisma/client"' "./services/${SERVICE_NAME}/package.json"; then \
      echo "node-linker=hoisted" >> .npmrc; \
    fi && \
    echo "inject-workspace-packages=true" >> .npmrc && \
    pnpm --filter @kern/${SERVICE_NAME} --prod deploy /app/out

# Robustly find and copy the generated Prisma client into the deploy output.
# With pnpm's isolated linker, prisma generate may write .prisma into
# node_modules/.pnpm/*/node_modules/.prisma instead of the root node_modules/.prisma
RUN if grep -q '"@prisma/client"' "./services/${SERVICE_NAME}/package.json"; then \
      PRISMA_DIR=$(find /app/node_modules -type d -name ".prisma" 2>/dev/null | head -1) && \
      echo "Found .prisma at: $PRISMA_DIR" && \
      if [ -n "$PRISMA_DIR" ]; then \
        cp -R "$PRISMA_DIR" /app/out/node_modules/.prisma; \
        echo "Copied .prisma to /app/out/node_modules/.prisma"; \
      else \
        echo "ERROR: .prisma not found anywhere in node_modules!"; \
        exit 1; \
      fi \
    fi

# =============================================================================
# STAGE 4: runner — Minimal production image.
# =============================================================================
FROM node:22-slim AS runner

RUN apt-get update -y && \
    apt-get install -y --no-install-recommends openssl && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

ARG SERVICE_NAME

# Copy the deployed bundle (includes prod deps, package.json, and generated prisma)
COPY --from=deployer /app/out/node_modules ./node_modules
COPY --from=deployer /app/out/package.json ./package.json

# Copy the compiled dist folders from the builder stage.
COPY --from=builder /app/packages/shared/package.json ./packages/shared/
COPY --from=builder /app/packages/shared/dist ./packages/shared/dist
COPY --from=builder /app/services/${SERVICE_NAME}/dist ./services/${SERVICE_NAME}/dist

# Copy OpenAPI specs
COPY --from=builder /app/services/${SERVICE_NAME}/openapi.yaml* ./services/${SERVICE_NAME}/

# Gateway static specs support
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

USER node

CMD ["sh", "-c", "node services/${SERVICE_NAME}/dist/main.js"]
