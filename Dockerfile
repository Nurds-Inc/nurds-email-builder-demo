FROM node:22-bookworm-slim AS build

ENV PNPM_HOME=/pnpm
ENV PATH=$PNPM_HOME:$PATH
ARG EMAIL_BUILDER_CLIENT_ID=NURDS_STAGING
ARG EMAIL_BUILDER_TOKEN_API_ORIGIN=https://api.sandbox.nurds.com

ENV CLIENT_ID=$EMAIL_BUILDER_CLIENT_ID
ENV EMAIL_BUILDER_TOKEN_API_ORIGIN=$EMAIL_BUILDER_TOKEN_API_ORIGIN

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@9.15.9 --activate

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm build

FROM nginxinc/nginx-unprivileged:1.27-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 8080
