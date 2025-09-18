# Stage 1: Builder
FROM node:22-alpine AS builder

WORKDIR /usr/src/app

RUN npm install -g pnpm
RUN apk add --no-cache ffmpeg libc6-compat

COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --include=dev

COPY . .

RUN pnpm exec prisma generate
RUN pnpm run build 

EXPOSE 5000
CMD ["pnpm", "run", "start:dev"]