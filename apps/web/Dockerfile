FROM node:22-alpine AS build
WORKDIR /repo
RUN corepack enable

# instale bun runtime (não use "pnpm add -g bun")
RUN apk add --no-cache curl bash \
  && curl -fsSL https://bun.sh/install | bash \
  && ln -sf /root/.bun/bin/bun /usr/local/bin/bun

RUN pnpm set config virtual-store-dir .pnpm-store

COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./
RUN pnpm fetch

COPY apps/api apps/api
COPY apps/web apps/web
COPY packages packages

RUN pnpm install -r --prefer-offline

WORKDIR /repo/apps/api
RUN pnpm db:generate
RUN pnpm build

WORKDIR /repo/apps/web
RUN pnpm build

FROM nginx:1.27-alpine
COPY --from=build /repo/apps/web/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]