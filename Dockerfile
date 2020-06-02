FROM node:alpine
LABEL maintainer="Jisu Kim <webmaster@alien.moe>"

RUN apk add --no-cache openjdk8 python3 bash make g++ tzdata
ENV JAVA_HOME=/usr/lib/jvm/java-1.8-openjdk
ENV PATH="$JAVA_HOME/bin:${PATH}"
ENV TZ Asia/Seoul

WORKDIR /usr/src/app
COPY package.json yarn.lock ./

RUN yarn

COPY . .

RUN yarn build

RUN echo '*/5  *  *  *  *    cd /usr/src/app && yarn crawler' > /etc/crontabs/root

EXPOSE 9000
CMD [ "yarn", "start" ]
