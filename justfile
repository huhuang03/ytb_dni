set windows-shell := ["powershell.exe", "-NoLogo", "-Command"]

build:
    yarn build:firefox
    yarn build:chrome
    python scripts/publish.py
    python scripts/distribute_firefox_src.py
