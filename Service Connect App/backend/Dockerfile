# ==========================================
# Stage 1: Build the TypeScript application
# ==========================================
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

# ==========================================
# Stage 2: Create the minimal production runtime
# ==========================================
FROM node:20-alpine AS runner

ENV NODE_ENV=production

WORKDIR /app

COPY package*.json ./

RUN npm ci --only=production

COPY --from=builder /app/dist ./dist

RUN chown -R node:node /app

USER node

EXPOSE 5000

CMD ["node", "dist/index.js"]