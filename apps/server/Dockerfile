# Use Node.js base image (not Alpine to avoid DNS issues)
FROM node:20-slim AS base

# Install system dependencies including OpenSSL for Prisma
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

# Install pnpm and turbo globally
RUN npm install -g pnpm turbo

# Set working directory
WORKDIR /app

# Copy root package files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./

# Copy packages source code (needed for workspace dependencies)
COPY packages/ ./packages/

# Copy server app package.json
COPY apps/server/package.json ./apps/server/

# Install dependencies
RUN pnpm install

# Copy server source code
COPY apps/server/src ./apps/server/src
COPY apps/server/tsconfig.json ./apps/server/

# Build stage
FROM base AS builder

# Build the packages first (including all dependencies)
RUN turbo build --filter=@monorepo/database
RUN turbo build --filter=@monorepo/types
RUN turbo build --filter=@monorepo/utils

# Generate Prisma client
RUN cd packages/database && pnpm db:generate

# Build the server
RUN turbo build --filter=server

# Production stage
FROM node:20-slim AS production

# Install system dependencies including OpenSSL for Prisma
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

# Install pnpm
RUN npm install -g pnpm

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/server/package.json ./apps/server/

# Copy all package.json files for workspace resolution
COPY packages/ui/package.json ./packages/ui/
COPY packages/utils/package.json ./packages/utils/
COPY packages/database/package.json ./packages/database/
COPY packages/types/package.json ./packages/types/
COPY packages/eslint-config/package.json ./packages/eslint-config/
COPY packages/tsconfig/package.json ./packages/tsconfig/

# Install ALL dependencies (including dev dependencies for Prisma)
RUN pnpm install --ignore-scripts

# Copy built packages from builder stage (including all dist files)
COPY --from=builder /app/packages ./packages

# Copy built server application
COPY --from=builder /app/apps/server/dist ./apps/server/dist

# Copy Prisma files specifically
COPY --from=builder /app/packages/database/prisma ./packages/database/prisma

# Generate Prisma client in production with proper environment
ENV DATABASE_URL="postgresql://placeholder:placeholder@placeholder:5432/placeholder?schema=public"
RUN cd packages/database && pnpm db:generate

# Expose port
EXPOSE 3001

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3001
ENV HOST=0.0.0.0

# Change to server app directory
WORKDIR /app/apps/server

# Start the application
CMD ["node", "dist/main.js"] 