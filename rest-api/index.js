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
const bodyParser = require('body-parser');
const passport = require('passport');

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
// Enable passport authentication middleware
app.use(passport.initialize());

// Use the 'dev' template of logging for all requests to the app
app.use(morgan('dev'));

// Parse url enocded parameters from requests and place in req.params for all requests
app.use(bodyParser.urlencoded({extended: true}));

// ROUTING
const router = express.Router();

// Controller for route '<hostname>/'
router.get('/', function(req, res){
  res.render('index');
});

router.use('/api', apiRouter);

app.use('/', router);

app.listen(80);
console.log('Listening on port 80');
