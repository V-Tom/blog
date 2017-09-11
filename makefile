install:
	cd app && npm install --registry=https://registry.npm.taobao.org

online:
	cd app && pm2 startOrRestart ecosystem.json

.PHONY: online
