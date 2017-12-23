#! /bin/bash
docker image build . -t daustin/monitor-api
tar cvz --exclude=./node_modules --exclude=server.tar.gz -f server.tar.gz .
scp -i ~/.ssh/my-ec2-key-pair.pem server.tar.gz ec2-user@35.177.187.171:~
rm server.tar.gz
ssh -i ~/.ssh/my-ec2-key-pair.pem ec2-user@35.177.187.171 << 'ENDSSH'
mkdir server
cd server
tar xf ../server.tar.gz
rm ../server.tar.gz
docker-compose down
docker container rm -f $(docker container ls -aq)
docker-compose up -d --build
ENDSSH
