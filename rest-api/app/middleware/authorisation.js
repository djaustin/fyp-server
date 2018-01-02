/**
 * This module provides middleware as a more convenient way to check that an authenticated user is authorized to access a resource.
 * For example, if /users/1234 is accessed, it can be checked that user 1234 has been authenicated on the request
 */

/**
 * Checks that the authenticated user has the same ID as the resource being accessed.
 * If they are the same, the next middleware is called.
 * If they are not the same, a 403 error witha message is returned in the response
 * @param paramIdName {String} The name of the ID parameter in the URL
 */
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
