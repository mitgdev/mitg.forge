FROM node:22-alpine AS build
WORKDIR /repo
RUN corepack enable

# instale bun runtime (não use "pnpm add -g bun")
RUN apk add --no-cache curl bash unzip \
  && curl -fsSL https://bun.sh/install | bash \
  && ln -sf /root/.bun/bin/bun /usr/local/bin/bun

RUN pnpm set config virtual-store-dir .pnpm-store

COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./
RUN pnpm fetch

COPY apps/api apps/api
COPY packages packages

RUN pnpm install -r --prefer-offline

WORKDIR /repo/apps/api

# ================================
# OUTFITS CONFIG
# ================================
# pasta destino dentro do container, relativa ao WORKDIR
ARG OUTFIT_FOLDER=generated/outfits
ENV OUTFIT_FOLDER=${OUTFIT_FOLDER}

# URL do zip de outfits
ARG OUTFIT_ARCHIVE_URL="https://ots.me/downloads/data/outfit-images/latest_walk.zip"
ENV OUTFIT_ARCHIVE_URL=${OUTFIT_ARCHIVE_URL}

# nome da pasta que queremos pegar de dentro do zip (ex: outfits_anim)
ARG OUTFIT_INNER_NAME=outfits_anim
ENV OUTFIT_INNER_NAME=${OUTFIT_INNER_NAME}

RUN mkdir -p "${OUTFIT_FOLDER}" \
  && echo "Baixando outfits de ${OUTFIT_ARCHIVE_URL}..." \
  && curl -L "${OUTFIT_ARCHIVE_URL}" -o /tmp/outfits.zip \
  && unzip -q /tmp/outfits.zip -d /tmp/outfits \
  # encontra a primeira pasta com o nome configurado (ex: outfits_anim)
  && OUTFITS_SRC_DIR="$(find /tmp/outfits -type d -name "${OUTFIT_INNER_NAME}" | head -n 1)" \
  && if [ -z "$OUTFITS_SRC_DIR" ]; then echo "Erro: não encontrei pasta '${OUTFIT_INNER_NAME}' dentro do zip" && exit 1; fi \
  && echo "Encontrado: ${OUTFITS_SRC_DIR} -> ${OUTFIT_FOLDER}" \
  && mv "$OUTFITS_SRC_DIR" "${OUTFIT_FOLDER}" \
  && rm -rf /tmp/outfits /tmp/outfits.zip

RUN pnpm db:generate
RUN pnpm build

ENV NODE_ENV=production
EXPOSE 4000
CMD ["bun", "run", "dist/index.js"]
