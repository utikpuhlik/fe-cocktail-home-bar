FROM oven/bun:1.3.11-alpine AS base
WORKDIR /app

FROM base AS install
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

FROM base AS builder

ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_APP_URL

ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
ENV NEXT_PUBLIC_APP_URL=${NEXT_PUBLIC_APP_URL}

# Fake secrets for build (overridden at runtime via K8s)
ENV DATABASE_URL=postgres://postgres.com
ENV BETTER_AUTH_SECRET=fake_secret

COPY --from=install /app/node_modules ./node_modules
COPY . .

RUN bun run build

FROM base AS runner

ENV NEXT_TELEMETRY_DISABLED=1

COPY --from=builder --chown=bun:bun /app/.next/standalone ./
COPY --from=builder --chown=bun:bun /app/public ./public
COPY --from=builder --chown=bun:bun /app/.next/static ./.next/static

RUN mkdir -p .next/cache && chown -R bun:bun .next

USER bun

EXPOSE 3000

CMD ["bun", "server.js"]
