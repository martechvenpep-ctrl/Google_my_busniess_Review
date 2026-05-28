# Step 1: Base Image for compilation
FROM node:20-alpine AS builder
WORKDIR /app

# Step 2: Install dependencies
COPY package*.json ./
RUN npm ci

# Step 3: Copy source code and build production Vite bundle
COPY . .
RUN node node_modules/vite/bin/vite.js build

# Step 4: Production runner stage
EXPOSE 3000
ENV NODE_ENV=production
CMD ["npm", "start"]
