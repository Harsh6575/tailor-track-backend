# ---- Base Stage ----
FROM node:22-alpine AS base
WORKDIR /app

# Install pnpm globally
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy only package manifests first (for caching)
COPY package.json pnpm-lock.yaml ./

# Fetch dependencies without installing (creates store cache)
RUN pnpm fetch

# ---- Build Stage ----
FROM node:22-alpine AS build
WORKDIR /app
ENV NODE_ENV=production

# Enable pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy manifests + pnpm store from previous stage
COPY --from=base /root/.local/share/pnpm /root/.local/share/pnpm
COPY package.json pnpm-lock.yaml ./

# Install all deps using the offline cache
RUN pnpm install --frozen-lockfile --offline

# Copy rest of the source
COPY . .

# Build TypeScript
RUN pnpm run build

# ---- Runtime Stage ----
FROM node:22-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
ENV HUSKY=0

RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy only what's needed for runtime
COPY --from=build /app/package.json /app/pnpm-lock.yaml ./
COPY --from=build /app/dist ./dist
COPY --from=build /root/.local/share/pnpm /root/.local/share/pnpm

# Install production deps first (as root)
RUN pnpm install --prod --offline

# Then switch to non-root
RUN addgroup -S appgroup && adduser -S appuser -G appgroup \
  && chown -R appuser:appgroup /app
USER appuser

EXPOSE 4000
CMD ["node", "dist/server.js"]