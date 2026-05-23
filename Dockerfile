# =============================================================================
# STAGE 1: deps — Full install for all packages to build the dependency graph.
# =============================================================================
FROM node:22-slim AS deps

ENV CI=true

RUN apt-get update -y && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/config-typescript/package.json ./packages/config-typescript/
COPY packages/config-eslint/package.json ./packages/config-eslint/
COPY packages/config-prettier/package.json ./packages/config-prettier/
COPY packages/core-backend/package.json ./packages/core-backend/
COPY packages/database/package.json ./packages/database/
COPY apps/api-gateway/package.json ./apps/api-gateway/
COPY apps/web/package.json ./apps/web/
COPY services/organizations-service/package.json ./services/organizations-service/
COPY services/content-service/package.json ./services/content-service/
COPY services/social-service/package.json ./services/social-service/
COPY services/ai-service/package.json ./services/ai-service/
COPY services/billing-service/package.json ./services/billing-service/
COPY services/notifications-service/package.json ./services/notifications-service/
COPY services/admin-service/package.json ./services/admin-service/

RUN pnpm install --frozen-lockfile

# =============================================================================
# STAGE 2: builder — Compile TypeScript
# =============================================================================
FROM deps AS builder

ARG SERVICE_NAME
ARG SERVICE_PATH

COPY packages/config-typescript/ ./packages/config-typescript/
COPY packages/config-eslint/ ./packages/config-eslint/
COPY packages/config-prettier/ ./packages/config-prettier/
COPY packages/core-backend/ ./packages/core-backend/
COPY packages/database/ ./packages/database/
COPY ${SERVICE_PATH}/ ./${SERVICE_PATH}/

RUN pnpm install --frozen-lockfile

# Generate Prisma client in the builder so TypeScript has access to the generated types.
RUN if grep -q '"@prisma/client"' "./${SERVICE_PATH}/package.json"; then \
      npx prisma generate --schema=./packages/database/prisma/schema.prisma; \
    fi

RUN pnpm --filter @kern/core-backend build
RUN pnpm --filter @kern/database build
RUN pnpm --filter @kern/${SERVICE_NAME} build

# =============================================================================
# STAGE 3: deployer — Extract service and generate production Prisma client
# =============================================================================
FROM builder AS deployer

# Force a flat node_modules for the deployed output if the service uses Prisma.
# The isolated (symlink) linker causes @prisma/client to resolve from inside
# .pnpm/... where it cannot find the generated .prisma/client folder.
RUN if grep -q '"@prisma/client"' "./${SERVICE_PATH}/package.json"; then \
      echo "node-linker=hoisted" >> .npmrc; \
    fi && \
    echo "inject-workspace-packages=true" >> .npmrc && \
    echo "force-legacy-deploy=true" >> .npmrc && \
    pnpm --filter @kern/${SERVICE_NAME} --prod deploy /app/out --legacy


# Robustly find and copy the generated Prisma client into the deploy output.
RUN if grep -q '"@prisma/client"' "./${SERVICE_PATH}/package.json"; then \
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

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

ARG SERVICE_NAME
ARG SERVICE_PATH
ENV SERVICE_PATH=${SERVICE_PATH}

# Copy the deployed bundle (includes prod deps, package.json, and generated prisma)
COPY --from=deployer /app/out/node_modules ./node_modules
COPY --from=deployer /app/out/package.json ./package.json

# Copy the compiled dist folders from the builder stage.
COPY --from=builder /app/packages/core-backend/package.json ./packages/core-backend/
COPY --from=builder /app/packages/core-backend/dist ./packages/core-backend/dist
COPY --from=builder /app/packages/database/package.json ./packages/database/
COPY --from=builder /app/packages/database/dist ./packages/database/dist

COPY --from=builder /app/${SERVICE_PATH}/dist* ./${SERVICE_PATH}/dist/
COPY --from=builder /app/${SERVICE_PATH}/.next* ./${SERVICE_PATH}/.next/
COPY --from=builder /app/${SERVICE_PATH}/public* ./${SERVICE_PATH}/public/
COPY --from=builder /app/${SERVICE_PATH}/next.config* ./${SERVICE_PATH}/

# Copy OpenAPI specs
COPY --from=builder /app/${SERVICE_PATH}/openapi.yaml* ./${SERVICE_PATH}/

# Gateway static specs support
RUN mkdir -p \
      apps/api-gateway \
      services/organizations-service \
      services/content-service \
      services/ai-service \
      services/notifications-service \
      services/social-service \
      services/billing-service \
      services/admin-service

COPY apps/api-gateway/openapi.yam[l] ./apps/api-gateway/
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

CMD ["sh", "-c", "if [ \"$SERVICE_NAME\" = \"web\" ]; then pnpm --filter @kern/web start --port 8000; else node ${SERVICE_PATH}/dist/main.js; fi"]
