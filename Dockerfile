FROM node:22 AS builder

# corepack reads the pinned pnpm version from the packageManager field
RUN corepack enable

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

RUN pnpm install --frozen-lockfile

COPY ./ /app

ENV NODE_OPTIONS=--openssl-legacy-provider

# vue-cli-service build loads .env.production by itself; values that are not
# committed come in as build args, and process env vars take precedence over it
ARG VUE_APP_MATOMO_SITE_ID
ARG VUE_APP_INCLUSION_TOKEN

RUN pnpm run build

FROM nginx:alpine-slim

COPY --from=builder /app/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /app/dist
