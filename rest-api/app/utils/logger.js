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
    // Console output - colorised
    new (winston.transports.Console)({
      timestamp: true,
      colorize: true,
      level: 'debug'
    }),
    new (winston.transports.File)({
      timestamp: true,
      filename: `${logDir}/server.log`,
      level: 'warn'
    })
  ]
});

module.exports = logger;
