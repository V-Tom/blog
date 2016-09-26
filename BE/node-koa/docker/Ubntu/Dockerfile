FROM ubuntu:16.04


RUN sed -i 's/archive.ubuntu.com/mirrors.ustc.edu.cn/g' /etc/apt/sources.list

RUN apt-get update

RUN apt-get install -y curl daemon git python build-essential

RUN curl -sL https://deb.nodesource.com/setup_4.x | bash -

RUN apt-get install -y nodejs

RUN useradd -m -s /bin/bash app


#ADD . /home/app/app

#WORKDIR /home/app/app

#RUN chown -R app:app .


#USER app

#RUN npm install --registry=https://registry.npm.taobao.org --disturl=https://npm.taobao.org/dist


#CMD ["daemon", "-f", "-r", "--", "npm", "start"]

EXPOSE 3000