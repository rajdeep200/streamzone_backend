FROM alpine:latest

RUN apk add --no-cache curl ffmpeg nodejs npm

# RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
#     && apk add --no-cache nodejs

WORKDIR /home/app

COPY package*.json /home/app

RUN npm install

COPY . /home/app

CMD [ "npm", "start" ]