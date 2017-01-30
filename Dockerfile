FROM node:6.9
EXPOSE 80

ENV PORT 80
ENV NODE_ENV production

ENV TOWNSHIP_SECRET "some secret string here"
ENV DATADIR /data
VOLUME /data

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY package.json /usr/src/app/
RUN npm install --production --loglevel warn && npm cache clean
COPY . /usr/src/app
RUN npm run build-css && npm run build-js-prod && npm run minify && npm run version

RUN cp example.config.js config.js
RUN node bin/render-static.js
# do docker exec: node /usr/src/app/server/database/init.js

CMD npm run server
