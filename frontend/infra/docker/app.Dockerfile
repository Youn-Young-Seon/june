FROM node:22-alpine AS build

WORKDIR /usr/src/app

COPY frontend/package*.json ./

RUN npm install
COPY frontend/. .

RUN npm run build

ENV PORT=4200
EXPOSE 4200

CMD ["node", "dist/june/server/server.mjs"]
