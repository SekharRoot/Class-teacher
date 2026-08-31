# --- Stage 1: Build the application ---
FROM node:22-slim AS builder

WORKDIR /app

# Copy dependency manifests
COPY package*.json ./

# Install all dependencies (including devDependencies for build)
RUN npm install

# Copy application source
COPY . .

# Build the frontend and backend bundle
RUN npm run build

# --- Stage 2: Serve the application ---
FROM node:22-slim AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=8080

# Copy dependency manifests, compiled outputs, and dependencies from builder
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3000
EXPOSE 8080

# Start the application
CMD ["node", "dist/server.cjs"]

