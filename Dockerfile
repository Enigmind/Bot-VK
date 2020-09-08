FROM node:14-alpine:latest

RUN mkdir -p /usr/src/bot
WORKDIR /usr/src/bot

COPY package*.json /usr/src/bot
RUN npm ci

COPY . /usr/src/bot

CMD ["node", "anick.js"]