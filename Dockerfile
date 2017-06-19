FROM node:slim

RUN mkdir /src

WORKDIR /src
ADD ./server/package.json /src/package.json
ADD ./server/yarn.lock /src/yarn.lock
ADD ./server/env.dist /src/.env
RUN yarn install

EXPOSE 3000

CMD npm start