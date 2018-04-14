dev:
	hugo server -w -D --disableFastRender dev

css:
	lessc -x ./less/index.less ./static/css/bundle.css

deploy:
	chmod +x ./deploy.sh && ./deploy.sh
