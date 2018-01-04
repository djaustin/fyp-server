/*
 * IMPORTS
 */

// Web framework
const express = require('express');
// HTML template engine
const pug = require('pug');
// Logging tool for requests
const morgan = require('morgan');
// mongodb interface
const mongoose = require('mongoose');
// Allow parameters in http body to be parsed and added to req object
const bodyParser = require('body-parser');
// Authentication middleware allowing multipl strategies (Basic, Bearer)
const passport = require('passport');
// Session middleware required for oauth2orize to track an authorization transaction
const session = require('express-session');
// Mongodb storage of express-session data instead of keeping it in local memory
const MongoStore = require('connect-mongo')(session);
// Helper functions for jsend standard
const jsend = require('jsend');

// Import configurations for this machine
const config = require('./config/config');

// Import custom winston logger
const logger = require('app/utils/logger');

// Imports beginning with 'app' are possible using a symlink to ./app in at location node_modules/app.
// This avoids excessive use of '../../' in other files as all files can be addressed from app directory
const apiRouter = require('app/routes/api')


/*
 * APPLICATION CONFIGURATION
 */

// TODO: Use authenticated login
mongoose.connect('mongodb://db/digitalmonitor', {useMongoClient: true});

// Initialise an express application
const app = express();

// Set pug as the view engine for this express app
app.set('view engine', 'pug');
app.set('views', './app/views');

// Enable jsend object in requests
app.use(jsend.middleware);

// Enable passport authentication middleware
app.use(passport.initialize());

// Use the 'dev' template of logging for all requests to the app
app.use(morgan('dev'));

// Parse url enocded parameters from requests and place in req.params for all requests
app.use(bodyParser.urlencoded({extended: true}));

app.use(session({
  secret: config.sessionSecret, // Store session key in config file
  resave: false, // Not required to keep session alive as MongoStore implements 'touch' event which does this for us
  saveUninitialized: false, // Do not keep 'empty' cookies. Only save if something was stored in them.
  store: new MongoStore({mongooseConnection: mongoose.connection})
}));

/**
 * ROUTING
 */

const router = express.Router();

// Controller for route '<hostname>/'
router.get('/', function(req, res){
  res.render('index');
});

router.use('/api', apiRouter);

app.use('/', router);

app.listen(80);
logger.info('Listening on port 80');
