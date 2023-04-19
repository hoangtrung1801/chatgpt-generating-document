#! /bin/bash
docker container prune -a -f
git pull origin develop
docker-compose down --remove-orphans
docker-compose up -d --build
