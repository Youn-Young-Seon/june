# Stage 1: Builder
FROM node:22-alpine AS builder

WORKDIR /usr/src/app

# Install pnpm and ffmpeg
RUN npm install -g pnpm
RUN apk add --no-cache ffmpeg

RUN pnpm Install

# Copy source code and prisma schema
COPY . .

EXPOSE 5000

# Generate Prisma client
RUN pnpm prisma generate

# Build the application
RUN pnpm run build 

# Start the application
CMD ["pnpm", "run", "start:dev"]