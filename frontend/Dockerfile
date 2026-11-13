# ============================================================
# Stage 1: Builder
# Build Vue 3 app ke static files dengan Vite
# ============================================================
FROM node:22-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy seluruh source frontend
COPY . .

# Build production bundle (output ke /app/dist)
RUN npm run build

# ============================================================
# Stage 2: Runner
# Serve static files dengan Nginx ringan
# ============================================================
FROM nginx:alpine-slim AS runner

# Hapus default config Nginx
RUN rm /etc/nginx/conf.d/default.conf

# Copy custom Nginx config
COPY nginx/default.conf /etc/nginx/conf.d/default.conf

# Copy hasil build Vue dari stage builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Port Nginx
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

