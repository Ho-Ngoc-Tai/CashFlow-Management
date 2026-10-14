FROM node:22-alpine AS builder
WORKDIR /app

# Enable pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile || pnpm install

COPY . .

# Build Next.js with standalone output
ENV NEXT_TELEMETRY_DISABLED=1
RUN pnpm run build

# Stage 2: Production Minimal Runner
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Install tini for graceful shutdown and create non-root user
RUN apk add --no-cache tini libc6-compat && \
    addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 appuser

# Copy standalone output and static assets
COPY --from=builder --chown=appuser:nodejs /app/.next/standalone ./
COPY --from=builder --chown=appuser:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=appuser:nodejs /app/public ./public

USER appuser

EXPOSE 3000

ENTRYPOINT ["tini", "--"]
CMD ["node", "server.js"]
