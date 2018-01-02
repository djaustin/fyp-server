FROM node
EXPOSE 80
VOLUME /var/www/api/logs
WORKDIR /var/www/api

COPY package.json .
RUN npm install
COPY . .


CMD ["node", "index.js"]
