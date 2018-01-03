exports.authenticatedUserOwnsResource = function(paramIdName){
  return function(req, res, next){
    const authenticatedId = req.user._id;
    const requestId = req.params[paramIdName];

    if(authenticatedId != requestId){
      res.status(403);
      res.json({message: 'Authenticated user is not authorized for that operation.'});
    } else {
      next();
    }
  }
};
