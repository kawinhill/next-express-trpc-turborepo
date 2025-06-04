# Use Node.js base image (not Alpine to avoid DNS issues)
FROM node:20-slim AS base

# Install pnpm and turbo globally
RUN npm install -g pnpm turbo

# Set working directory
WORKDIR /app

# Copy root package files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./

# Copy packages source code (needed for workspace dependencies)
COPY packages/ ./packages/

# Copy web app package.json
COPY apps/web/package.json ./apps/web/

# Copy server source for type imports
COPY apps/server/src ./apps/server/src
COPY apps/server/package.json ./apps/server/

# Install dependencies
RUN pnpm install

# Copy web source code and ALL configuration files
COPY apps/web/src ./apps/web/src
COPY apps/web/public ./apps/web/public
COPY apps/web/next.config.js ./apps/web/
COPY apps/web/tailwind.config.ts ./apps/web/
COPY apps/web/postcss.config.mjs ./apps/web/
COPY apps/web/tsconfig.json ./apps/web/
COPY apps/web/next-env.d.ts ./apps/web/

# Build stage
FROM base AS builder

# Build the packages first (including UI package with CSS)
RUN turbo build --filter=@monorepo/ui
RUN turbo build --filter=@monorepo/utils
RUN turbo build --filter=@monorepo/types
RUN turbo build --filter=@monorepo/database

# Build the web app
RUN turbo build --filter=web

# Production stage
FROM node:20-slim AS production

# Install pnpm
RUN npm install -g pnpm

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/web/package.json ./apps/web/

# Copy all package.json files for workspace resolution
COPY packages/ui/package.json ./packages/ui/
COPY packages/utils/package.json ./packages/utils/
COPY packages/database/package.json ./packages/database/
COPY packages/types/package.json ./packages/types/
COPY packages/eslint-config/package.json ./packages/eslint-config/
COPY packages/tsconfig/package.json ./packages/tsconfig/

# Copy built packages from builder stage (including CSS files)
COPY --from=builder /app/packages ./packages

# Copy built web application
COPY --from=builder /app/apps/web/.next ./apps/web/.next
COPY --from=builder /app/apps/web/public ./apps/web/public
COPY --from=builder /app/apps/web/next.config.js ./apps/web/

# Install production dependencies
RUN pnpm install --prod --ignore-scripts

# Expose port
EXPOSE 3000

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Change to web app directory
WORKDIR /app/apps/web

# Start the application
CMD ["pnpm", "start"] 