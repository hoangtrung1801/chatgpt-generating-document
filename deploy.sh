#! /bin/bash
docker container prune -af
git pull origin develop
docker-compose down --remove-orphans
docker-compose up -d --build
