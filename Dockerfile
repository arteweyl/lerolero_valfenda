# Stage 1: Build the frontend
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Production image
FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/server ./server
COPY --from=builder /app/.env.example ./.env

EXPOSE 3333
ENV NODE_ENV=production
CMD ["node", "server/index.mjs"]
