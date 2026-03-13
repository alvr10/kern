FROM node:20-alpine
WORKDIR /app
COPY services/social-service/package*.json ./
RUN npm ci
COPY services/social-service/ .
RUN npm run build
EXPOSE 3005
CMD ["node", "dist/main.js"]
