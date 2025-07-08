# Node.js Alpine 이미지 사용
FROM node:alpine AS development

# 작업 디렉토리 설정
WORKDIR /usr/src/app

# package.json과 package-lock.json 복사
COPY package*.json ./

# 의존성 설치
RUN npm install

# 나머지 파일/폴더 복사
COPY . .

# Angular 개발 서버 실행
CMD ["npm", "run", "start"]