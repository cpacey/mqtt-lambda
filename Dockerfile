FROM node:4.1.0
MAINTAINER Canadian Tire Innovations

ENV SUBSCRIBERS_ROOT=/opt/mqtt-subscribers

COPY . /opt/mqtt-lambda
WORKDIR /opt/mqtt-lambda
RUN npm install --production

CMD [ "/opt/mqtt-lambda/bin/mqtt-lambda" ]
