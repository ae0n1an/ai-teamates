# syntax=docker/dockerfile:1

# Keep in sync with .nvmrc (Prisma 7 requires Node 22.12+).
ARG NODE_VERSION=22.23.3

FROM node:${NODE_VERSION}-slim AS base
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1

# Install dependencies. The postinstall script runs `prisma generate`,
# which needs the schema and config but never connects to the database.
FROM base AS deps
COPY package.json package-lock.json .npmrc prisma.config.ts ./
COPY prisma ./prisma
RUN DATABASE_URL="postgresql://build:build@localhost:5432/build" npm ci

FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/lib/generated ./lib/generated
COPY . .
# Placeholders so modules that read env at import time can load during the
# build. Real values are injected at runtime and never baked into the image.
RUN DATABASE_URL="postgresql://build:build@localhost:5432/build" \
    BETTER_AUTH_SECRET="build-time-placeholder-secret-not-used-at-runtime" \
    npm run build

# One-off image that pushes the Prisma schema to the database before the app starts.
# TODO(prod): --force-reset wipes the database on every start. Dev-only; replace
# with a data-preserving strategy before we support production.
FROM base AS db-push
COPY --from=deps /app/node_modules ./node_modules
COPY package.json prisma.config.ts ./
COPY prisma ./prisma
CMD ["npx", "prisma", "db", "push", "--force-reset"]

FROM base AS runner
ENV NODE_ENV=production \
    PORT=3000 \
    HOSTNAME=0.0.0.0

COPY --from=builder --chown=node:node /app/public ./public
COPY --from=builder --chown=node:node /app/.next/standalone ./
COPY --from=builder --chown=node:node /app/.next/static ./.next/static

USER node
EXPOSE 3000
CMD ["node", "server.js"]
