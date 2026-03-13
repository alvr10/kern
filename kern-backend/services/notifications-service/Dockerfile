FROM node:20-slim
RUN apt-get update -y && apt-get install -y openssl
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build -w @kern/shared
RUN npm run build -w @kern/notifications-service
EXPOSE 3006
CMD ["node", "services/notifications-service/dist/main.js"]




