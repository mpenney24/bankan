FROM node:22-alpine

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@latest --activate

COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./
COPY app/web/package.json ./app/web/
COPY packages/domain/package.json ./packages/domain/

RUN pnpm fetch

COPY . .

RUN pnpm i --frozen-lockfile --offline

EXPOSE 5173

CMD ["pnpm", "dev"]