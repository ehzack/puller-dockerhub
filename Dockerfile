FROM node:alpine3.17

RUN echo 'http://ftp.halifax.rwth-aachen.de/alpine/v3.16/main' >> /etc/apk/repositories
RUN echo 'http://ftp.halifax.rwth-aachen.de/alpine/v3.16/community' >> /etc/apk/repositories
RUN apk update
RUN apk add docker docker-cli-compose


WORKDIR /app

COPY package.json package.json


RUN yarn install

COPY . .
RUN chmod +x ./scripts/*

CMD [ "yarn", "start" ]
