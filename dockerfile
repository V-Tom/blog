# docker file

FROM ubuntu:16.10

MAINTAINER Nomand <iamnomand@gmail.com>

RUN apt-get update

# Install needed deps and clean up after
RUN echo '正在更新系统'
RUN apt-get install -y -q --no-install-recommends \
    apt-transport-https \
    build-essential \
    ca-certificates \
    curl \
    g++ \
    gcc \
    git \
    make \
    nginx \
    sudo \
    wget \
    && rm -rf /var/lib/apt/lists/* \
    && apt-get -y autoclean

RUN echo '正在安装 nvm nodejs'
# Install nvm with node and npm
RUN curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.26.0/install.sh | bash \
    && source $NVM_DIR/nvm.sh \
    && nvm install $NODE_VERSION \
    && nvm alias default $NODE_VERSION \
    && nvm use default

RUN echo '正在安装 git'
RUN apt-get install -y git

RUN echo '正在创建根目录'
RUN mkdir -p /home/blog-stable

RUN echo '正在设置工作目录'
WORKDIR /home/blog-stable

RUN echo '正在从GitHub下载代码'
RUN git clone git@github.com:V-Tom/blog.git -b koa

RUN echo '正在安装 mongodb'
RUN apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 7F0CEB10
RUN echo 'deb http://downloads-distro.mongodb.org/repo/ubuntu-upstart dist 10gen' | tee /etc/apt/sources.list.d/mongodb.list
RUN apt-get update
RUN apt-get install -y mongodb-org

RUN mkdir /home/blog-stable/mongodb/db
RUN mkdir /home/blog-stable/mongodb/log
RUN mkdir /home/blog-stable/mongodb/log/log.log

RUN echo '正在安装 redis'


RUN echo '正在安装 pm2'
RUN npm install pm2 -g --registry https://registry.npm.taobao.org

RUN echo '正在安装 Node server 依赖'
RUN npm install -d --registry https://registry.npm.taobao.org

RUN echo '正在抛出端口 3000 27017'
EXPOSE 3000 27017

#RUN echo '正在启动服务'
#CMD ["node","server.js"]


