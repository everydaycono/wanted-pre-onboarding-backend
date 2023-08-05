FROM node:18.14.2

WORKDIR /app

COPY package.json ./
COPY prisma ./prisma/

RUN yarn

COPY . .
# 포트 설정
EXPOSE 8000
# 컨테이너 시작 시 실행할 명령어
CMD ["yarn", "start"]