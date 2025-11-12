# 1단계: React 빌드 (Node 20 이상으로 변경)
FROM node:20 AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# Vite 개발 서버 실행
CMD ["npm", "run", "dev"]
EXPOSE 3000