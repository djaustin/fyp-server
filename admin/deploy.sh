#! /bin/bash
# Build Docker image using the local Dockerfil
docker image build . -t daustin/monitor-api

# Create compressed project archive
tar cvz --exclude=./node_modules --exclude=server.tar.gz --exclude=./.git --exclude=docker-compose.yml --exclude=./logs -f server.tar.gz .

# Copy the archive to the remote server
scp -i ~/.ssh/my-ec2-key-pair.pem server.tar.gz ubuntu@35.177.187.171:~

# Remove local archive copy
rm server.tar.gz

# SSH into remote server and execute the following instructions:
  # 1. Create a 'server' directory if one does not already exist
  # 2. Extract the archive file that was copied across into the server directory
  # 3. Remove the archive file after extraction
  # 4. Rename docker-compose-remote.yml to docker-compose.yml for convenience with the docker-compose command
  # 5. Stop any existing version of the application and remove all containers
  # 6. Create symlink necessary for creating the docker image correctly
  # 7. Build and start the docker system
ssh -i ~/.ssh/my-ec2-key-pair.pem ubuntu@35.177.187.171 << 'ENDSSH'
export NODE_ENV=development
mkdir server
cd server
mkdir logs
tar xf ../server.tar.gz
rm ../server.tar.gz
mv docker-compose-remote.yml docker-compose.yml
docker-compose down
docker container rm -f $(docker container ls -aq)
mkdir node_modules
# This link needs to exist so that files can be 'required' from the app root. It has to be copied to the docker image
ln -s ../app node_modules/app
docker-compose up -d --build
ENDSSH

newman run tests/postman/digital-monitor-tests.postman_collection.json -e tests/postman/aws.postman_environment.json
