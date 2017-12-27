const Organisation = require('app/models/organisation');

exports.newOrganisation = function (req, res){
  const organisation = new Organisation({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    applications: []
  });

  organisation.save(function(err){
    if(err){
      // NOTE: Consider changing this for security
      res.send(err);
    } else {
      // Respond with location of created entity
      res.status(201);
      res.json({
        location: `https://digitalmonitor.tk/api/organisations/${organisation._id}`
      });
    }
  })
};

exports.getOrganisation = function(req, res){
  Organisation.find({_id: req.params.organisationId}, '_id email name id', function(err, organisation){
    if(err){
      res.send(err);
    } else {
      res.json(organisation);
    }
  })
}

exports.allOrganisations = function(req, res){
  Organisation.find(function(err, orgs){
    if(err) res.send(err);
    res.json({
      message: `Request recieved by ${req.user.name}`,
      organisations: orgs
    });
  });
};
