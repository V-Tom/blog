FROM node:latest

MAINTAINER Nomand <iamnomand@gmail.com>

RUN mkdir -p /home/blog

WORKDIR /home/blog

#RUN export http_proxy=http://duotai:7E-18c6is@sheraton.h.xduotai.com:23186
#RUN export https_proxy=$http_proxy

#RUN npm config set registry https://registry.npm.taobao.org

RUN npm install pm2 -g --registry https://registry.npm.taobao.org

COPY . /home/blog

#RUN npm install

#CMD ["make","online"]
#CMD ["node","server.js"]

EXPOSE 3000

