FROM node:20-slim
RUN apt-get update -y && apt-get install -y openssl
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build -w @kern/shared
RUN npm run build -w @kern/content-service
EXPOSE 3004
CMD ["node", "services/content-service/dist/main.js"]




