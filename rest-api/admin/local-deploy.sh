#! /bin/bash
export NODE_ENV=development
docker-compose down
docker-compose up --build -d
newman run tests/postman/digital-monitor-tests.postman_collection.json -e tests/postman/local.postman_environment.json
