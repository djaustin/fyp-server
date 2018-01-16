const Client = require('app/models/client');
const Application = require('app/models/application');
const RefreshToken = require('app/models/refreshToken');
const AccessToken = require('app/models/accessToken')
const logger = require('app/utils/logger');

/**
 * Gets all clients connected to the application provided.
 * @param req Request paramater that contains the application id in req.params.applicationId
 * @param res {Object} Response parameter with which to send result to client
 * @param next {Object} next piece of middleware to be run after this one. Used to forward errors to error
 */
exports.getApplicationClients = async function(req, res, next){
  // TODO: Perhaps consider adding middleware to fetch the application from the db so it doesn't have to be done in all the children requests
  try{
    // Get application instance first
    const application = await Application.findOne({_id: req.params.applicationId});
    // Get clients from the application
    const clients = await Client.find({_id : { $in: application.clientIds} }, '_id name id');
    res.jsend.success({clients: clients});
  } catch(err){
    next(err);
  }
}

/**
 * Add a new application client to the database using the applicationId in the request URL and the client details in the request body
 * @param req Request parameter containing the applicationId (req.params) and the client details (req.body)
 * @param res {Object} Response parameter with which to send result to client
 * @param next {Object} next piece of middleware to be run after this one. Used to forward errors to error
 */
exports.newApplicationClient = async function(req, res, next){
  // Create new in-memory client
  const client = new Client({
    name: req.body.name,
    id: req.body.id,
    secret: req.body.secret, //TODO: Think about how this will be generated. It will be hashed in the database but there are probably standards for this kind of thing. Maybe it could just be a GUID and then get sent back in the response
    applicationId: req.params.applicationId,
    redirectUri: req.body.redirectUri,
    isThirdParty: true,
    platform: req.body.platform
  });
  try{
    // Try to save the new client object
    await client.save();
    // Retrieve the application we are attaching this to
    const application = await Application.findOne({_id: req.params.applicationId});
    // Add the client _id field to the application document
    application.clientIds.push(client._id);
    // Try to save the application object
    await application.save();
    res.status(201);
    res.jsend.success({
      client: client,
      locations: [`https://digitalmonitor.tk/api/organisations/${req.params.organisationId}/applications/${req.params.applicationId}/clients/${client._id}`]
    });
  } catch (err){
    next(err);
  }
}

/**
 * Get an application client by client Id
 * @param req Request object containing the clientId in rew.params
 * @param res {Object} Response parameter with which to send result to client
 * @param next {Object} next piece of middleware to be run after this one. Used to forward errors to error
 */
exports.getApplicationClient = async function(req, res, next){
  try{
    const client = await Client.findOne({_id: req.params.clientId}, {secret: 0});
    res.jsend.success({client: client});
  } catch(err){
    next(err);
  }
}

/**
 * Delete an application client by ID.
 * @param req Request object containing the clientId in req.params
 * @param res {Object} Response parameter with which to send result to client
 * @param next {Object} next piece of middleware to be run after this one. Used to forward errors to error
 */
 //TODO: Consider desired behaviour if this is deleted. Should usage logs also go? Maybe just flag as deleted so it still exists in the system for posterity
exports.deleteApplicationClient = async function(req, res, next){
  try{
    await Client.remove({_id: req.params.clientId});
    res.jsend.success(null);
  } catch(err){
    next(err);
  }
}

/**
 * Edit an application client by ID
 * @param req {Object} request object containing the clientId in req.params and the new client data in req.body
 * @param res {Object} Response parameter with which to send result to client
 * @param next {Object} next piece of middleware to be run after this one. Used to forward errors to error
 */
// TODO: Which fields should be allowed to change?
exports.editApplicationClient = async function(req, res, next){
  try{
    await Client.update({_id: req.params.clientId}, {$set: req.body});
    res.jsend.success(null)
  } catch(err){
    next(err);
  }
}

/**
 * Get all clients with valid refresh tokens for a given user by userId
 * @param req {Object} request object containing the userId in req.params
 * @param res {Object} Response parameter with which to send result to client
 * @param next {Object} next piece of middleware to be run after this one. Used to forward errors to error
 */
exports.getUserClients = async function(req, res, next){
  try{
    // Get refresh tokens assigned to user
    const tokens = await RefreshToken.find({userId: req.params.userId}, {clientId: 1})
    const clientIds = tokens.map(e => e.clientId)

    // Get all clientIds of those refresh tokens
    // Search for client objects matching those Ids
    const clients = await Client.find({_id: { $in: clientIds }}, {secret: 0})
    res.jsend.success({clients: clients})
  } catch (err) {
    next(err)
  }
}

/**
 * Revoke client (clientId) access to a user (userId) by removing all access and refresh tokens
 * @param req {Object} request object containing the userId and clientId in req.params
 * @param res {Object} Response parameter with which to send result to client
 * @param next {Object} next piece of middleware to be run after this one. Used to forward errors to error
 */
 exports.revokeClientAccess = async function(req, res, next){
   const queryParams = {
     clientId: req.params.clientId,
     userId: req.params.userId
   }

   try{
      await Promise.all([RefreshToken.remove(queryParams), AccessToken.remove(queryParams)])
      res.jsend.success(null)
   } catch(err){
     next(err)
   }

 }
