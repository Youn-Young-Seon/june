# Node.js Alpine 이미지 사용
FROM node:alpine AS development

WORKDIR /usr/src/app

# package.json과 pnpm-lock.yaml 복사
COPY package*.json ./
COPY pnpm-lock.yaml ./

RUN npm install -g nodemon

# PNPM 설치
RUN npm i -g pnpm
# 의존성 설치
RUN pnpm i

# 나머지 파일/폴더 복사
COPY . .

# NestJS 개발 서버 실행
CMD ["pnpm", "start:dev"]
