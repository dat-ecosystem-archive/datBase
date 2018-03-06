FROM node:6.9

ENV PORT 80
EXPOSE ${PORT}

ENV NODE_ENV development

ENV TOWNSHIP_SECRET "some secret string here"
ENV DATADIR /data
VOLUME ${DATADIR}

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY package.json /usr/src/app/
RUN npm install --production --loglevel warn
COPY . /usr/src/app
RUN npm run build-js-prod \
    && npm run build-css \
    && npm run minify \
    && npm run version

# make it possible to use the image by default
COPY config/default.js config/config.development.js

# do docker exec: npm run database

CMD npm run database \
    && DEBUG=dat-registry npm run server
