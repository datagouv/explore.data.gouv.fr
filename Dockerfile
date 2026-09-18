FROM node:22 AS builder

# corepack reads the pinned pnpm version from the packageManager field
RUN corepack enable

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

RUN pnpm install --frozen-lockfile

COPY ./ /app

ENV NODE_OPTIONS=--openssl-legacy-provider

RUN if [ -f /app/.env ]; then export $(grep -v '^#' /app/.env | xargs); fi && \
    pnpm run build

FROM nginx:alpine-slim

COPY --from=builder /app/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /app/dist
