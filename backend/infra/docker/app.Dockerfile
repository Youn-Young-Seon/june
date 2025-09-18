FROM node:22-alpine AS builder

WORKDIR /usr/src/app

RUN npm install -g pnpm
RUN apk add --no-cache ffmpeg libc6-compat

COPY backend/package.json backend/pnpm-lock.yaml* ./
RUN pnpm install --include=dev

COPY backend ./backend
WORKDIR /usr/src/app/backend

RUN npx prisma generate
RUN DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy" npx prisma generate --schema=./prisma/schema.prisma

RUN pnpm install
RUN pnpm run build 

EXPOSE 5000
CMD ["pnpm", "run", "start:dev"]