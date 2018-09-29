FROM node:7.7.2-alpine

WORKDIR /usr/app

COPY package.json .

# RUN apk add --no-cache python python-dev python3 python3-dev && \
RUN npm  install --quiet

COPY . .
