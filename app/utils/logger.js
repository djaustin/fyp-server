/**
 * This module defines the configuration of the winston logger for the application
 */

// Import winston library
const winston = require('winston');
// File system support
const fs = require('fs');
const logDir = './logs';

// Create logDir if it does not exist already
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

// Create the logger
const logger = new (winston.Logger)({
  transports: [
    new (winston.transports.File)({
      timestamp: true,
      filename: `${logDir}/server.log`,
      level: 'warn'
    })
  ]
});

if(process.env.NODE_ENV !== 'test'){
  // Console output - colorised
  logger.add(winston.transports.Console, {
    timestamp: true,
    colorize: true,
    level: 'debug'
  });
}


module.exports = logger;
