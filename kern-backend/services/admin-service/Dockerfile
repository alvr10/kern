FROM node:20-alpine
WORKDIR /app
COPY services/admin-service/package*.json ./
RUN npm ci
COPY services/admin-service/ .
COPY prisma ./prisma
RUN npx prisma generate --schema=./prisma/schema.prisma
RUN npm run build
EXPOSE 3009
CMD ["node", "dist/main.js"]
