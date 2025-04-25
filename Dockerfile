FROM node:20-alpine
USER root
RUN apk add docker docker-cli-compose
WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile

COPY . .

RUN chmod +x ./scripts/*


CMD ["yarn", "start"]
