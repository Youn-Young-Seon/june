# Stage 1: Builder
FROM node:22-alpine AS builder

WORKDIR /usr/src/app

RUN npm install -g pnpm
RUN apk add --no-cache ffmpeg libc6-compat

COPY backend/package.json backend/pnpm-lock.yaml* ./
RUN pnpm install --include=dev

COPY backend ./backend
WORKDIR /usr/src/app/backend

RUN npx prisma generate --schema=./backend/prisma/schema.prisma
RUN pnpm run build 

EXPOSE 5000
CMD ["pnpm", "run", "start:dev"]