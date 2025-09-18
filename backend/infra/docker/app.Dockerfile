
FROM node:22-alpine AS builder

WORKDIR /usr/src/app

# Install pnpm and ffmpeg
RUN npm install -g pnpm && apk add --no-cache ffmpeg
COPY backend/package.json backend/pnpm-lock.yaml ./

RUN pnpm install
COPY backend/. .

RUN npx prisma generate
RUN pnpm run build 

EXPOSE 5000
CMD ["node", "dist/main"]
