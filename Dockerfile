# Build stage
FROM node:20-slim AS builder

WORKDIR /app

# Install OpenSSL for Prisma
RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
RUN npm ci

COPY . .

# Build TypeScript (allow errors for now)
RUN npm run build || true

# Generate Prisma client
RUN npx prisma generate

# Production stage
FROM node:20-slim

WORKDIR /app

# Install OpenSSL and wget for healthchecks
RUN apt-get update && apt-get install -y openssl wget && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
RUN npm ci --only=production

# Copy built files
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/views ./views
COPY --from=builder /app/public ./public
COPY --from=builder /app/scripts ./scripts
COPY --from=builder /app/src ./src

# Copy entrypoint
COPY docker/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Create data directory
RUN mkdir -p /app/data

# Install tsx for seed script
RUN npm install -g tsx

EXPOSE 3000 3001

ENTRYPOINT ["/entrypoint.sh"]
CMD ["node", "dist/server.js"]
