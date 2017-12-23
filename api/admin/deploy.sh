#! /bin/bash
docker image build . -t daustin/monitor-api
tar cfz server.tar.gz .
scp -i ~/.ssh/my-ec2-key-pair.pem server.tar.gz ec2-user@ec2-35-177-41-163.eu-west-2.compute.amazonaws.com:~
rm server.tar.gz
ssh -i ~/.ssh/my-ec2-key-pair.pem ec2-user@ec2-35-177-41-163.eu-west-2.compute.amazonaws.com << 'ENDSSH'
mkdir server
cd server
tar xf ../server.tar.gz
rm ../server.tar.gz
docker-compose down
docker container rm -f $(docker container ls -aq)
docker-compose up -d --build
ENDSSH
