# Stage 1: Install dependencies
FROM node:22-alpine AS builder

WORKDIR /usr/src/app

# Install pnpm and ffmpeg
RUN npm install -g pnpm && apk add --no-cache ffmpeg

# Copy dependency definition files
COPY backend/package.json backend/pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install

# Copy the rest of the application source code
COPY backend/. .

# Generate Prisma client
RUN npx prisma generate

# Build the application
RUN pnpm run build

# Stage 2: Create production image
FROM node:22-alpine AS production

WORKDIR /usr/src/app

# Install pnpm and ffmpeg
RUN npm install -g pnpm && apk add --no-cache ffmpeg

# Copy dependency definition files
COPY backend/package.json backend/pnpm-lock.yaml ./

# Install only production dependencies
RUN pnpm install --prod

# Copy the built application from the builder stage
COPY --from=builder /usr/src/app/dist ./dist

# Copy prisma schema
COPY --from=builder /usr/src/app/prisma ./backend/prisma
COPY --from=builder /usr/src/app/node_modules/.prisma ./backend/node_modules/.prisma


# Expose the application port
EXPOSE 5000

# Command to run the application
CMD ["node", "dist/main"]
