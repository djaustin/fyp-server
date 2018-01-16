exports.runIfQueryExists = function(middleware) {
  return function(req, res, next){
    // If req.query has no members, skip to next middleware
    if (Object.keys(req.query).length === 0){
      return next()
    } else {
      // Call the provided middleware with the req, res, next objects
      middleware(res, res, next)
    }
  }
}
