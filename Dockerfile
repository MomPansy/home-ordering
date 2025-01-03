FROM node:20-slim AS base
ENV HOME=/home/hono
ENV PNPM_HOME="$HOME/.pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN mkdir -p $HOME && \
    addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 --gid 1001 hono && \
    chown -R hono:nodejs $HOME && \
    corepack enable && \
    corepack prepare pnpm@9.1.1 --activate
WORKDIR /app
COPY . .
USER hono

FROM base AS prod-deps
RUN --mount=type=cache,id=pnpm,target=$PNPM_HOME/store pnpm install --prod --frozen-lockfile

FROM base AS build
RUN --mount=type=cache,id=pnpm,target=$PNPM_HOME/store pnpm install --frozen-lockfile && \
    pnpm run build

FROM base
WORKDIR /app
COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY package.json ./
EXPOSE 3000
ENV NODE_ENV=production
CMD ["pnpm", "run", "start"]
