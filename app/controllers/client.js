/**
 * Controller to manage the handling of requests to endpoints for the Client resource.
 */

const Client = require('app/models/client');
const Application = require('app/models/application');
const Platform = require('app/models/platform');
const RefreshToken = require('app/models/refreshToken');
const AccessToken = require('app/models/accessToken')
const logger = require('app/utils/logger');
const uid = require('uid2');

/**
 * Gets all clients connected to the application provided.
 * @param req {Object} Request paramater that contains the application id in req.params.applicationId
 * @param res {Object} Response parameter with which to send result to client
 * @param next {Object} next piece of middleware to be run after this one. Used to forward errors to error
 */
exports.getApplicationClients = async function(req, res, next){
  try{
    // Get application document first
    const application = await Application.findOne({_id: req.params.applicationId});
    // Get clients from the application
    const clients = await Client.find({_id : { $in: application.clientIds} });
    res.jsend.success({clients: clients});
  } catch(err){
    next(err);
  }
}

/**
 * Add a new application client to the database using the applicationId in the request URL and the client details in the request body
 * @param req {Object} Request parameter containing the applicationId (req.params) and the client details (req.body)
 * @param res {Object} Response parameter with which to send result to client
 * @param next {Object} next piece of middleware to be run after this one. Used to forward errors to error
 */
exports.newApplicationClient = async function(req, res, next){
  // Find platform details from provided platform ID
  const platform = await Platform.findOne({_id: req.body.platformId});

  // Return error if invalid platform ID
  if(!platform){
    let error = new Error('Unable to find platform with ID ' + req.body.platformId)
    error.status = 422;
    return next(error);
  }

  // Create new in-memory client
  const client = new Client({
    name: req.body.name,
    id: uid(128),
    secret: uid(128),
    applicationId: req.params.applicationId,
    redirectUri: req.body.redirectUri,
    isThirdParty: true,
    platform: req.body.platformId
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
 * Get an application client by client ID
 * @param req {Object} Request object containing the clientId in rew.params
 * @param res {Object} Response parameter with which to send result to client
 * @param next {Object} next piece of middleware to be run after this one. Used to forward errors to error
 */
exports.getApplicationClient = async function(req, res, next){
  try{
    const client = await Client.findOne({_id: req.params.clientId});
    res.jsend.success({client: client});
  } catch(err){
    next(err);
  }
}

/**
 * Delete an application client by ID.
 * @param req {Object} Request object containing the clientId in req.params
 * @param res {Object} Response parameter with which to send result to client
 * @param next {Object} next piece of middleware to be run after this one. Used to forward errors to error
 */
exports.deleteApplicationClient = async function(req, res, next){
  try{
    // Find the client document matching the ID provided
    const client = await Client.findOne({_id: req.params.clientId});
    // Remove the client document from the database
    await client.remove()
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
    // Extract client IDs from the refresh tokens
    const clientIds = tokens.map(e => e.clientId)
    // Search for client documents matching those Ids
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
      // Simultaneously delete refesh tokens and access tokens for the client-user pair
      await Promise.all([RefreshToken.remove(queryParams), AccessToken.remove(queryParams)])
      res.jsend.success(null)
   } catch(err){
     next(err)
   }

 }
