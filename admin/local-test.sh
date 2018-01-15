#! /bin/bash
export NODE_ENV=development
docker-compose -f docker-compose-test.yml down
docker-compose -f docker-compose-test.yml up --build -d && docker-compose -f docker-compose-test.yml logs -f web
