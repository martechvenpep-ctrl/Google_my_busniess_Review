# ─── Stage 1: Build the Vite React frontend ──────────────────────────────────
FROM node:20-alpine AS builder
WORKDIR /app

# Install all deps (including devDependencies needed for vite build)
COPY package*.json ./
RUN npm ci

# Copy source and compile
COPY . .
RUN node node_modules/vite/bin/vite.js build

# ─── Stage 2: Lean production image ──────────────────────────────────────────
FROM node:20-alpine AS production
WORKDIR /app

# Only install production dependencies
COPY package*.json ./
RUN npm ci --omit=dev

# Copy compiled frontend and backend server
COPY --from=builder /app/dist ./dist
COPY server.js ./

# Expose port and start
EXPOSE 3000
ENV NODE_ENV=production
CMD ["node", "server.js"]
