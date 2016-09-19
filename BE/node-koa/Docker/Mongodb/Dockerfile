FROM mongo:latest

MAINTAINER Nomand <iamnomand@gmail.com>

COPY mongod.conf /usr/local/etc/mongo/mongo.conf

VOLUME /data/db /data/configdb

CMD ["mongod","-f","/usr/local/etc/mongo/mongo.conf"]


EXPOSE 27017 28017