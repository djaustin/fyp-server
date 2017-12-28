const Organisation = require('app/models/organisation');

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
    // Respond with location of created entity
    res.status(201);
    res.json({
      organisation: organisation,
      location: `https://digitalmonitor.tk/api/organisations/${organisation._id}`
    });
  } catch(err){
    // NOTE: Consider changing this for security
    res.send(err);
  }
};

// Get a single organisation from the database which is parsed in as part of the api endpoint.
// eg. /api/organisations/:organisationId
exports.getOrganisation = async function(req, res){
  try{
      const organisation = await Organisation.findOne({_id: req.params.organisationId}, '_id email name id');
      res.json(organisation);
  } catch(err){
      res.sedn(err);
  }
}

// GET all organisations from the database
// TEMP: Only here for testing.
exports.allOrganisations = async function(req, res){
  try{
    const organisations = await Organisation.find();
    res.json({
      message: `Request recieved by ${req.user.name}`,
      organisations: orgs
    });
  } catch(err){
    res.send(err);
  }
};
