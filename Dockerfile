FROM node:lts-alpine3.18 AS appbuild
WORKDIR /usr/src/app
COPY package.json ./
RUN npm install
COPY build.js ./
COPY ./dependencies ./dependencies
COPY ./pages ./pages
RUN npm run build

FROM nginx:latest as service
COPY --from=appbuild /usr/src/app/dist /usr/share/nginx/html
