const winston = require('winston');
const fs = require('fs');
const logDir = './logs';

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const logger = new (winston.Logger)({
  transports: [
    // Console output - colorised
    new (winston.transports.Console)({
      timestamp: () => {Date.now()},
      colorize: true,
      level: 'debug'
    }),
    new (winston.transports.File)({
      timestamp: () => {Date.now()},
      filename: `${logDir}/server.log`,
      level: 'debug'
    })
  ]
});

module.exports = logger;
