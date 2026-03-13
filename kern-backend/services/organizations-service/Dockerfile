FROM node:20-alpine
WORKDIR /app
COPY services/organizations-service/package*.json ./
RUN npm ci
COPY services/organizations-service/ .
COPY prisma ./prisma
RUN npx prisma generate --schema=./prisma/schema.prisma
RUN npm run build
EXPOSE 3002
CMD ["node", "dist/main.js"]
