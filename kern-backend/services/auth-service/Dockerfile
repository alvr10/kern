FROM node:20-alpine
WORKDIR /app
COPY services/auth-service/package*.json ./
RUN npm ci
COPY services/auth-service/ .
# Bring in the shared Prisma schema (build context = repo root)
COPY prisma ./prisma
RUN npx prisma generate --schema=./prisma/schema.prisma
RUN npm run build
EXPOSE 3001
CMD ["node", "dist/main.js"]
