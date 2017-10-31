FROM node:latest

ADD . /app
WORKDIR /app

RUN npm i

ENTRYPOINT npm start
