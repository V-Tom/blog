fe-dev:
	cd ./FE/react && make dev

fe-build:
	cd ./FE/react && make builds

be-koa-online:
	cd ./BE/node-koa/ && git pull origin dev && make install && make online
	