FROM node:6.9
EXPOSE 80

ENV PORT 80
ENV NODE_ENV development

ENV TOWNSHIP_SECRET "some secret string here"
ENV DATADIR /data
VOLUME /data

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY package.json /usr/src/app/
RUN npm install --production --loglevel warn && npm cache clean
COPY . /usr/src/app
RUN npm run build-css && npm run build-js-prod && npm run minify && npm run version

# do docker exec: npm run database

CMD npm run database && npm run server
