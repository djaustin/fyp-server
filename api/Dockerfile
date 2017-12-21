FROM node

WORKDIR /var/www/api

COPY package.json .
RUN npm install
COPY . . 
EXPOSE 80

CMD ["node", "server.js"]
