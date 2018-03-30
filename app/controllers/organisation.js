/**
 * Controller to manage the handling of requests to the endpoints for the organisation resource
 */
const Organisation = require('app/models/organisation');
const logger = require('app/utils/logger');

/**
 * Add a new organisation to the database using provided data
 * @param req {Object} Request parameter containing the organisation details in req.body
 * @param res {Object} Response parameter with which to send result to client
 * @param next {Function} next piece of middleware to be run after this one. Used to forward errors to error
 */
exports.newOrganisation = async function (req, res, next){
  const organisation = new Organisation({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    applications: []
  });

  try{
    await organisation.save();
    // Set to undefined so we don't send it back to client
    organisation.password = undefined;
    // Respond with locations of created entity
    res.status(201);
    res.jsend.success({
      organisation: organisation,
      locations: [`https://digitalmonitor.tk/api/organisations/${organisation._id}`]
    });
  } catch(err){
    next(err);
  }
};

/**
 * Get a single organisation by id provided in the request url
 * @param req {Object} Request object containing object Id in req.params
 * @param res {Object} Response parameter with which to send result to client
 * @param next {Function} next piece of middleware to be run after this one. Used to forward errors to error
 */
exports.getOrganisation = async function(req, res, next){
  try{
      const organisation = await Organisation.findOne({_id: req.params.organisationId}, {password: 0});
      res.jsend.success({organisation: organisation});
  } catch(err){
    next(err);
  }
}

/**
 * Delete an organisation by Id
 * @param req {Object} request object containing the organisationId of the authencticated organisation to delete in req.params
 * @param res {Object} Response parameter with which to send result to client
 * @param next {Function} next piece of middleware to be run after this one. Used to forward errors to error
 */
exports.deleteOrganisation = async function(req, res, next){
  try{
    await Organisation.remove({_id: req.params.organisationId});
    res.jsend.success(null);
  } catch(err){
    next(err);
  }
}

/**
 * Edit an organisation by Id
 * @param req {Object} request object containing the organisationId of the authencticated organisation to edit in req.params as well as the details to be changed in req.body
 * @param res {Object} Response parameter with which to send result to client
 * @param next {Function} next piece of middleware to be run after this one. Used to forward errors to error
 */
exports.editOrganisation = async function(req, res, next){
  try{
    const detailsToUpdate = {}
    if(req.body.email) detailsToUpdate.email = req.body.email;
    if(req.body.name) detailsToUpdate.name = req.body.name;
    await Organisation.update({_id: req.params.organisationId}, {$set: detailsToUpdate});
    res.jsend.success(null);
  } catch(err){
    next(err);
  }
}

/**
 * Get organisations by query
 * @param req {Object} request object containing the query used to find organisations in req.query
 * @param res {Object} Response parameter with which to send result to client
 * @param next {Function} next piece of middleware to be run after this one. Used to forward errors to error
 */
exports.getOrganisations = async function(req, res, next){
  try{
    var organisations
    if(!req.query){
      organisations = []
    } else {
      organisations = await Organisation.find(req.query, {password: 0})
    }
    res.jsend.success({organisations: organisations})
  } catch(err){
    next(err);
  }
};
