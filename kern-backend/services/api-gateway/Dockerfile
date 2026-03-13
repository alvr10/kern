FROM node:20-alpine
WORKDIR /app
COPY services/api-gateway/package*.json ./
RUN npm ci
COPY services/api-gateway/ .
RUN npm run build
EXPOSE 3000
CMD ["node", "dist/main.js"]
