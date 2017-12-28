#! /bin/bash
docker image build . -t daustin/monitor-api
tar cvz --exclude=./node_modules --exclude=server.tar.gz -f server.tar.gz .
scp -i ~/.ssh/my-ec2-key-pair.pem server.tar.gz ubuntu@35.177.187.171:~
rm server.tar.gz
ssh -i ~/.ssh/my-ec2-key-pair.pem ubuntu@35.177.187.171 << 'ENDSSH'
mkdir server
cd server
tar xf ../server.tar.gz
rm ../server.tar.gz
docker-compose -f docker-compose-remote.yml down
docker container rm -f $(docker container ls -aq)
mkdir node_modules
# This link needs to exist so that files can be 'required' from the app root. It has to be copied to the docker image
ln -s ../app node_modules/app
docker-compose -f docker-compose-remote.yml up -d --build
ENDSSH