exports.authenticatedUserOwnsResource = function(paramIdName){
  return function(req, res, next){
    //TODO: Error handling here
    let user;
    // This is different depending on whether authentication used basic or bearer
    if(req.user.user){
      user = req.user.user;
    } else if(req.user) {
      user = req.user;
    }

    const authenticatedId = user._id;
    const requestId = req.params[paramIdName];

    if(authenticatedId != requestId){
      res.status(403);
      res.json({message: 'Authenticated user is not authorized for that operation.'});
    } else {
      next();
    }
  }
};
