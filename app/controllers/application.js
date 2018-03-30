/**
 * Controller to manage the handling of requests to endpoints for the Application resource.
 */

// Import data model for mongodb interface
const Application = require('app/models/application');
const UsageLog = require('app/models/usage-log');
const RefreshToken = require('app/models/refreshToken');
const Client = require('app/models/client');
const logger = require('app/utils/logger');

/**
 * Add a new application to the database under the given authenticated and authorized organisation
 * @param req {Object} request object containing the authenticated organisation in req.user
 * @param res {Object} respnse object with which to send client feedback
 * @param next {Function} next piece of middleware to be run after this one. Used to forward errors to error handler
 */
exports.postApplication = async function(req, res, next){
  const organisation = req.organisation;

  // Create a new application document from the model. Initialise with provided name and empty client list
  const application = new Application({
    name: req.body.name,
    clientIds: []
  });

  // 'await' operations in this block are asynchronous. This language structure prevents deep nested callback functions
  try{
    // Save the application to the database
    await application.save();
    // Add the application id to the organisation's application list
    organisation.applicationIds.push(application._id);
    // Save the organisation
    await organisation.save();
    // Status 201 - Created
    res.status(201);
    // Provide endpoint locations for the newly created application
    res.jsend.success({
      application: application,
      locations: [`https://digitalmonitor.tk/api/organisations/${req.params.organisationId}/applications/${application._id}`]
    });
  } catch(err){
    next(err);
  }
};


/**
 * Get all applications for a given organisation.
 * @param req {Object} request object containing the organisation object in req.user
 * @param res {Object} response object with which to send client feedback.
 * @param next {Function} next piece of middleware to be run after this one. Used to forward errors to error handler
 */
exports.getOrganisationApplications = async function(req, res, next){
  const organisation = req.organisation;
  try{
    // Find applications
    const applications = await Application.find({ _id : { $in: organisation.applicationIds } });
    res.jsend.success({applications: applications});
  } catch(err){
    next(err);
  }
};

/**
 * Retrieve a single application belonging to the authenticated organisation by ID.
 * @param req {Object} request object containing the applicationId in req.params
 * @param res {Object} response object with which to send client feedback
 * @param next {Function} next piece of middleware to be run after this one. Used to forward errors to error handler
 */
exports.getOrganisationApplication = async function(req, res, next){
  try{
    const application = await Application.findOne({_id: req.params.applicationId});
    res.jsend.success({application: application});
  } catch(err){
    next(err);
  }
}

/**
 * Delete an organisation application by id.
 * @param req {Object} Request parameter containing the applicationId in req.parameters
 * @param res {Object} Response parameter with which to send result to client
 * @param next {Function} next piece of middleware to be run after this one. Used to forward errors to error handler
 */
exports.deleteOrganisationApplication = async function(req, res, next){
  try{
    const app = await Application.findOne({_id: req.params.applicationId})
    await app.remove()
    res.jsend.success(null);
  } catch(err){
    next(err);
  }
}

/**
 * Edit an organisation application by id
 * @param req {Object} request object containing the applicationId of the application to be altered in req.params.applicationId and the data to change in req.body
 * @param res {Object} response object with which to send results to client
 * @param next {Function} next piece of middleware to be run after this one. Used to forward errors to error handler
 */
 exports.editOrganisationApplication = async function(req, res, next){
   const detailsToUpdate = {}
   if(req.body.name) detailsToUpdate.name = req.body.name;
   try{
     await Application.update({_id: req.params.applicationId}, {$set: detailsToUpdate})
     res.jsend.success(null);
   } catch(err){
     next(err);
   }
 }

 /**
  * Get an organisation application by id
  * @param req {Object} request object containing the applicationId of the application to be retrieved in req.params.applicationId
  * @param res {Object} response object with which to send results to client
  * @param next {Function} next piece of middleware to be run after this one. Used to forward errors to error handler
  */
exports.getApplicationById = async function(req, res, next) {
  try {
    const id = req.params.applicationId
    if(!id) {
      throw Error("Query parameter 'id' not provided")
    }
    const application = await Application.findOne({_id: id})
    res.jsend.success({application: application})
  } catch (err) {
    next(err)
  }
}

/**
 * Get applications that have clients authorised by the authorised user
 * @param req {Object} request object containing the authorised user object in req.user
 * @param res {Object} response object with which to send results to client
 * @param next {Function} next piece of middleware to be run after this one. Used to forward errors to error handler
 */
exports.getUserAuthorisedApplications = async function(req, res, next){
  try {
    // Refresh tokens mean the client has access to this user
    const tokens = await RefreshToken.find({userId: req.user._id}, {clientId: 1})
    const firstPartyClients = await Client.find({isThirdParty: false}, {_id: 1})
    const firstPartyClientIds = firstPartyClients.map(e => String(e._id))
    const clientIds = tokens.map(e => e.clientId).filter(e => !firstPartyClientIds.includes(e))
    // Find all applications containing one of the clientIds in its clientIds field
    const applications = await Application.find({clientIds: {$in: clientIds}})
    res.jsend.success({applications: applications})
  } catch(err){
    next(err)
  }
}
