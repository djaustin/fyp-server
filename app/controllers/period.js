/**
 * Controller to manage the handling of requests to the endpoints for the period resource
 */

const Period = require('app/models/period');

/**
 * Get all periods from the database
 * @param req {Object} Request parameter containing details of the HTTP request
 * @param res {Object} Response parameter with which to send result to client
 * @param next {Function} next piece of middleware to be run after this one. Used to forward errors to error
 */
exports.getAllPeriods = async function(req, res, next){
  try{
    const periods = await Period.find();
    res.jsend.success({periods: periods});
  } catch(err){
    next(err);
  }
}
