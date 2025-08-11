set windows-shell := ["powershell.exe", "-NoLogo", "-Command"]

build:
    yarn build:firefox
    yarn build:chrome
    python scripts/publish.py
