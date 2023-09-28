FROM node:12.7-alpine AS build
# Create app directory
WORKDIR /app

# Install app dependencies
RUN apk add --update tzdata

# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
ADD package*.json ./
 
 
ENV TZ=Europe/Lisbon

RUN apk upgrade --update \
  && apk add -U tzdata \
  && cp /usr/share/zoneinfo/$TZ /etc/localtime \
  && apk del tzdata \
  && rm -rf \
  /var/cache/apk/*

# Install any needed packages
RUN npm update 
RUN npm install
 
# Bundle app source
COPY . /app

EXPOSE 8443
 
CMD [ "npm", "start" ]