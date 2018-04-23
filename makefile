dev:
	hugo server -w -D --disableFastRender dev

css:
	lessc -x ./less/index.less ./static/css/bundle.css

sub:
	git submodule add -b gh-pages -f git@github.com:V-Tom/blog.git  public

deploy:
	chmod +x ./deploy.sh && ./deploy.sh
