# Base image
FROM node:23-alpine

WORKDIR /app
ARG DATABASE_URL
ENV DATABASE_URL=${DATABASE_URL}

COPY package.json pnpm-lock.yaml ./
COPY prisma .

RUN npm install -g pnpm
RUN pnpm install

RUN DATABASE_URL=${DATABASE_URL} pnpm dlx prisma generate

COPY . .

RUN pnpm build

EXPOSE 3000

CMD [ "pnpm", "start" ]
