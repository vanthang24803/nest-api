FROM node:alpine

WORKDIR /app

RUN npm -g install pnpm

COPY package*.json ./

RUN pnpm install

COPY  . .

RUN pnpm build

EXPOSE 8080

CMD [ "pnpm", "start" ]