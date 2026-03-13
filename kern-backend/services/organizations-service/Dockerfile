FROM node:20-slim
RUN apt-get update -y && apt-get install -y openssl
WORKDIR /app
COPY . .
RUN npm install
RUN npx prisma generate --schema=./prisma/schema.prisma
RUN npm run build -w @kern/shared
RUN npm run build -w @kern/organizations-service
EXPOSE 3002
CMD ["node", "services/organizations-service/dist/main.js"]




