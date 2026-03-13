FROM node:20-slim
RUN apt-get update -y && apt-get install -y openssl
WORKDIR /app
COPY . .
RUN npm install
RUN npx prisma generate --schema=./prisma/schema.prisma
RUN npm run build -w @kern/shared
RUN npm run build -w @kern/admin-service
EXPOSE 3009
CMD ["node", "services/admin-service/dist/main.js"]




