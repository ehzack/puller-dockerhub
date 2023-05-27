FROM node:latest

WORKDIR /app

COPY package.json package.json


RUN yarn install

COPY . .

RUN yarn run init
CMD [ "yarn", "start" ]
