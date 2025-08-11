build-firefox:
	yarn install
	yarn build:firefox
	python scripts/publish.py
