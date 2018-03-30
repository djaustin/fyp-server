/**
 * Controller to manage the handling of requests to the endpoints for the platform resource
 */

const Platform = require('app/models/platform');

/**
 * Get all platforms from the database
 * @param req {Object} Request parameter containing details of the HTTP request
 * @param res {Object} Response parameter with which to send result to client
 * @param next {Function} next piece of middleware to be run after this one. Used to forward errors to error
 */
exports.getAllPlatforms = async function(req, res, next){
  try{
    const platforms = await Platform.find();
    res.jsend.success({platforms: platforms});
  } catch(err){
    next(err);
  }
}
