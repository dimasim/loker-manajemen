# ============================================================
# Stage 1: Builder
# Compile TypeScript ke JavaScript dan generate Prisma Client
# ============================================================
FROM node:22-alpine AS builder

WORKDIR /app

# Install dependencies (termasuk devDependencies untuk build)
COPY package*.json ./
RUN npm ci

# Copy source code dan Prisma schema
COPY tsconfig.json ./
COPY prisma ./prisma
COPY src ./src

# Generate Prisma Client dan compile TypeScript
RUN npx prisma generate
RUN npm run build

# Hapus devDependencies setelah build (hanya sisakan production deps)
RUN npm prune --production

# ============================================================
# Stage 2: Runner
# Image akhir yang ringan hanya berisi artifact production
# ============================================================
FROM node:22-alpine AS runner

# Install dumb-init untuk proper signal handling
RUN apk add --no-cache dumb-init

WORKDIR /app

# Jalankan sebagai non-root user untuk keamanan
USER node

# Copy artifact dari stage builder
COPY --chown=node:node --from=builder /app/dist ./dist
COPY --chown=node:node --from=builder /app/node_modules ./node_modules
COPY --chown=node:node --from=builder /app/prisma ./prisma
COPY --chown=node:node --from=builder /app/package.json ./package.json

# Port backend
EXPOSE 4000

# Gunakan dumb-init sebagai PID 1 agar sinyal (SIGTERM, SIGINT) diteruskan ke Node
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "dist/server.js"]

