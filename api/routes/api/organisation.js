const router = require('express').Router();

const authentication = require('../../controllers/authentication');
const Organisation = require('../../models/organisation');

// ADD A NEW ORGANISATION
router.post('/', function (req, res){
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
      // Remove password from object we're sending back to client
      organisation.password = undefined;
      res.json({
        message: 'New organisation added successfully',
        organisation: organisation
      })
    }
  })
});

// GET ALL ORGANISATIONS IN DATABASE
router.get('/', authentication.isOrganisationAuthenticated, function(req, res){
  Organisation.find(function(err, orgs){
    if(err) res.send(err);
    res.json({
      message: `Request recieved by ${req.user.name}`,
      organisations: orgs
    });
  });
});

module.exports = router;
