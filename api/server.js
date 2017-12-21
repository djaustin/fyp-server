/*
* IMPORTS
*/

// Web framework
const express = require('express');
// HTML template engine
const pug = require('pug');
// Logging tool for requests
const morgan = require('morgan');
// Initialise an express application
const app = express();



/*
* APPLICATION CONFIGURATION
*/
// Set pug as the view engine for this express app
app.set('view engine', 'pug');

// Use the 'dev' template of logging for all requests to the app
app.use(morgan('dev'));

// Controller for route '<hostname>/'
app.get('/', function(req, res){
  res.render('index');
})

app.listen(80);
console.log('Listening on port 80');
