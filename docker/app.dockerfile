FROM node:20-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
COPY . /app
WORKDIR /app

FROM base AS prod-deps
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile

FROM base AS build
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm run build

FROM node:20-alpine
WORKDIR /app
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 hono
COPY --from=prod-deps --chown=hono:nodejs /app/node_modules /app/node_modules
COPY --from=build --chown=hono:nodejs /app/dist /app/dist
COPY --chown=hono:nodejs .env package.json /app/
USER hono
EXPOSE 3000
ENV NODE_ENV=production
CMD ["pnpm", "run", "start"]
