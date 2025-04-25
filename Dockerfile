FROM node:20-alpine

USER root
RUN apk add --no-cache \
    curl \
    py3-pip \
    python3 \
    && pip3 install docker-compose \
    && curl -fsSL https://download.docker.com/linux/static/stable/x86_64/docker-24.0.7.tgz | tar xz -C /usr/local/bin --strip-components=1 docker/docker

RUN chmod +x ./scripts/*
CMD ["yarn", "start"]
