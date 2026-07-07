# --- Stage 1: Build the application ---
FROM node:22-alpine AS builder

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
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
# In Cloud Run, PORT is usually 8080, but we default to 8080 if not set.
# The server.ts will also default to 8080 or use the injected PORT.
ENV PORT=8080

# Copy dependency manifests and compiled outputs from builder
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist

# Install production-only dependencies
RUN npm install --omit=dev

# Expose the application port
EXPOSE 8080

# Start the application
CMD ["node", "dist/server.cjs"]
