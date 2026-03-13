FROM node:20-alpine
WORKDIR /app
COPY services/content-service/package*.json ./
RUN npm ci
COPY services/content-service/ .
RUN npm run build
EXPOSE 3004
CMD ["node", "dist/main.js"]
