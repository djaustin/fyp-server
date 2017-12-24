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

const userRoutes = require('./routes/user');
const organisationRoutes = require('./routes/organisation');
/*
* APPLICATION CONFIGURATION
*/

// TODO: Use authenticated login
mongoose.connect('mongodb://db/digitalmonitor', {useMongoClient: true});

// Initialise an express application
const app = express();

// Set pug as the view engine for this express app
app.set('view engine', 'pug');

// Enable passport authentication middleware
app.use(passport.initialize());

// Use the 'dev' template of logging for all requests to the app
app.use(morgan('dev'));

// Parse url enocded parameters from requests and place in req.params for all requests
app.use(bodyParser.urlencoded({extended: true}));

// Controller for route '<hostname>/'
app.get('/', function(req, res){
  res.render('index');
});

app.get('/api', function(req, res){
  res.json({message: 'Welcome to the Digital Monitor API'});
});

app.use('/api/users', userRoutes);
app.use('/api/organisations', organisationRoutes);


app.listen(80);
console.log('Listening on port 80');
