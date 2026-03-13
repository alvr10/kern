FROM node:20-slim
RUN apt-get update -y && apt-get install -y openssl
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build -w @kern/shared
RUN npm run build -w @kern/ai-service
EXPOSE 3008
CMD ["node", "services/ai-service/dist/main.js"]




