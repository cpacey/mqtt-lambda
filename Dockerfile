FROM node:4.4.2
MAINTAINER Canadian Tire Innovations

ENV SUBSCRIBERS_ROOT=/opt/mqtt-subscribers

COPY . /opt/mqtt-lambda
WORKDIR /opt/mqtt-lambda
RUN npm install --production

CMD [ "/opt/mqtt-lambda/bin/mqtt-lambda" ]

EXPOSE 80
