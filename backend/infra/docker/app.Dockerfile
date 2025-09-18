# Stage 1: Builder
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

RUN pnpm run build 

# Stage 2: Runner
FROM node:22-alpine AS runner

WORKDIR /usr/src/app/backend

RUN npm install -g pnpm
RUN apk add --no-cache ffmpeg libc6-compat

# node_modules는 빌더에서 가져오기
COPY --from=builder /usr/src/app/backend/node_modules ./node_modules
COPY --from=builder /usr/src/app/backend/dist ./dist
COPY --from=builder /usr/src/app/backend/prisma ./prisma
COPY backend/package.json ./

EXPOSE 5000
CMD ["pnpm", "run", "start:dev"]