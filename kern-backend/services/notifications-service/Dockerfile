FROM node:20-alpine
WORKDIR /app
COPY services/notifications-service/package*.json ./
RUN npm ci
COPY services/notifications-service/ .
RUN npm run build
EXPOSE 3006
CMD ["node", "dist/main.js"]
