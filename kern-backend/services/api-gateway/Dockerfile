FROM node:20-slim
RUN apt-get update -y && apt-get install -y openssl
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build -w @kern/shared
RUN npm run build -w @kern/api-gateway
EXPOSE 3000
CMD ["node", "services/api-gateway/dist/main.js"]




