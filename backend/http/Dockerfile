FROM node:23-alpine

WORKDIR /usr/src/app

COPY package.json pnpm-lock.yaml ./
COPY prisma ./prisma

RUN corepack enable pnpm
RUN pnpm install --ignore-scripts

COPY . .

CMD [ "pnpm", "dev:docker" ]
