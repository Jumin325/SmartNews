# 1단계: React 빌드 (Node 20 이상으로 변경)
FROM node:20 AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# Vite dev 서버가 외부에서 접속 가능하도록
ENV HOST=0.0.0.0
EXPOSE 3000

# Vite dev 서버 실행
CMD ["npm", "run", "dev"]