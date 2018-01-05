#! /bin/bash
docker-compose up --build -d
newman run tests/postman/digital-monitor-tests.postman_collection.json -e tests/postman/local.postman_environment.json
