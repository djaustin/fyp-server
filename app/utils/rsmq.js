const RedisSMQ = require('rsmq');
// Create a new rsmq instance for global access
module.exports = new RedisSMQ({host: "redis"});
