#! /bin/bash
docker container prune -af
git pull -f origin develop
docker-compose down --remove-orphans
docker-compose up -d --build
