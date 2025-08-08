build-firefox:
	yarn install
	yarn build:firefox
	python publish.py
