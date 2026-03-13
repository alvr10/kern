FROM node:20-alpine
WORKDIR /app
COPY services/projects-service/package*.json ./
RUN npm ci
COPY services/projects-service/ .
COPY prisma ./prisma
RUN npx prisma generate --schema=./prisma/schema.prisma
RUN npm run build
EXPOSE 3003
CMD ["node", "dist/main.js"]
