### STAGE 1: Build ###
FROM node:14.15-alpine AS build

RUN apk update && \
    apk add gettext

WORKDIR /app

ENV TZ=Europe/Lisbon
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
ADD package.json ./
# Install any needed packages
RUN npm update
RUN npm install
# Bundle app source
COPY . .

EXPOSE 4200 49153

CMD [ "npm", "start" ]