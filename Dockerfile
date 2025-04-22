FROM node:20-alpine

# Create a non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile

COPY . .

RUN chmod +x ./scripts/*

USER appuser

CMD ["yarn", "start"]
