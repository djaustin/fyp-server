const Organisation = require('app/models/organisation');
const logger = require('app/utils/logger');

exports.newOrganisation = async function (req, res){
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
    // NOTE: Consider changing this for security
    res.jsend.error(err);
  }
};

// Get a single organisation from the database which is parsed in as part of the api endpoint.
// eg. /api/organisations/:organisationId
exports.getOrganisation = async function(req, res){
  try{
      const organisation = await Organisation.findOne({_id: req.params.organisationId}, {password: 0});
      res.jsend.success({organisation: organisation});
  } catch(err){
      logger.error(err);
      res.jsend.error(err);
  }
}

/**
 * Delete an organisatiom by Id
 @param req {Object} request object containing the organisationId of the authencticated organisation to delete in req.params
 @param res {Object} response object with which the results will be sent to the client
 */
exports.deleteOrganisation = async function(req, res){
  try{
    await Organisation.remove({_id: req.params.organisationId});
    res.jsend.success(null);
  } catch(err){
    logger.error(err);
    res.jsend.error(err);
  }
}

/**
 * Edit an organisatiom by Id
 @param req {Object} request object containing the organisationId of the authencticated organisation to edit in req.params as well as the details to be changed in req.body
 @param res {Object} response object with which the results will be sent to the client
 */
exports.editOrganisation = async function(req, res){
  try{
    const detailsToUpdate = {}
    if(req.body.email) detailsToUpdate.email = req.body.email;
    if(req.body.name) detailsToUpdate.name = req.body.name;
    await Organisation.update({_id: req.params.organisationId}, {$set: detailsToUpdate});
    res.jsend.success(null);
  } catch(err){
    res.jsend.error(err);
  }
}

// GET all organisations from the database
// TEMP: Only here for testing.
exports.allOrganisations = async function(req, res){
  try{
    const organisations = await Organisation.find();
    res.jsend.success({organisations: organisations});
  } catch(err){
    logger.error(err);
    res.jsend.error(err);
  }
};
