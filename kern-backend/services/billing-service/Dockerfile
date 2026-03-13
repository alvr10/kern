FROM node:20-alpine
WORKDIR /app
COPY services/billing-service/package*.json ./
RUN npm ci
COPY services/billing-service/ .
COPY prisma ./prisma
RUN npx prisma generate --schema=./prisma/schema.prisma
RUN npm run build
EXPOSE 3007
CMD ["node", "dist/main.js"]
