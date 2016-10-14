install:
	cd src && npm install --registry=https://registry.npm.taobao.org

online:
	cd src && pm2 startOrRestart ecosystem.json

.PHONY: online