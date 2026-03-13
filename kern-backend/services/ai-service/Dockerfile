FROM node:20-alpine
WORKDIR /app
COPY services/ai-service/package*.json ./
RUN npm ci
COPY services/ai-service/ .
RUN npm run build
EXPOSE 3008
CMD ["node", "dist/main.js"]
