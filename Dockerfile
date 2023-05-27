FROM node:latest

WORKDIR /app

COPY package.json package.json
COPY yarn.lock yarn.lock

RUN npm install

COPY . .

RUN yarn run init
CMD [ "yarn", "start" ]
