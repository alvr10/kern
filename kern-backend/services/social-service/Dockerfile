FROM node:20-slim
RUN apt-get update -y && apt-get install -y openssl
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build -w @kern/shared
RUN npm run build -w @kern/social-service
EXPOSE 3005
CMD ["node", "services/social-service/dist/main.js"]




