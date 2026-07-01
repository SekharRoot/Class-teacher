# --- Stage 1: Build the application ---
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependency manifests
COPY package*.json ./

# Install all dependencies (including devDependencies for build)
RUN npm ci

# Copy application source
COPY . .

# Build the frontend and backend bundle
RUN npm run build

# --- Stage 2: Serve the application ---
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Copy dependency manifests and compiled outputs
COPY package*.json ./
COPY --from=builder /app/dist ./dist

# Install production-only dependencies
RUN npm ci --only=production

# Expose the application port
EXPOSE 3000

# Start the application
CMD ["node", "dist/server.cjs"]
