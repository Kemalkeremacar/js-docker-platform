FROM node:16
COPY example-app/ /app/
WORKDIR /app
RUN npm install