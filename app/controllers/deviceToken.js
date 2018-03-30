/**
 * Controller to manage the handling of requests to endpoints for the Device Token resource.
 */

const DeviceToken = require('app/models/deviceToken');

/**
 * Attach a user ID to a device token used for sending notifications to an iOS device
 * @param req {Object} request object containing the userId in req.body and the device token in req.params
 * @param res {Object} Response parameter with which to send result to client
 * @param next {Object} next piece of middleware to be run after this one. Used to forward errors to error
 */
exports.putDeviceToken = async function(req, res, next){
  try{
    // Search for a document with the provided device token
    const query = {value: req.params.deviceToken};
    // Set the user field to the user ID provided
    const newData = {value: req.params.deviceToken, user: req.body.userId};
    // Execute the query, create the document if it does not already exist
    const token = await DeviceToken.findOneAndUpdate(query, newData, {upsert: true});
    res.jsend.success(null);
  } catch(err){
    next(err);
  }
}
