/**
 * This module provides middleware as a more convenient way to deal with requests having queries
 */

/**
 * Function returns a middleware function that runs the provided middleware if the request contains a URL query and skips to the next middleware if there is no query
 * @param middleware {Function} Middleware function to run if there is a query on the request
 */
exports.runIfQueryExists = function(middleware) {
  return function(req, res, next){
    if (Object.keys(req.query).length === 0){
      // Skip to next middleware if there is no query
      return next()
    } else {
      middleware(res, res, next)
    }
  }
}
