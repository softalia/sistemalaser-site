.PHONY: build clean validate

build:
	node scripts/build-blog.mjs

clean:
	rm -rf dist

validate: build
	node scripts/validate-site.mjs
	node --check scripts/build-blog.mjs
	node --check scripts/validate-site.mjs
