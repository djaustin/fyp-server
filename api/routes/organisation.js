const router = require('express').Router();
const Organisation = require('../models/organisation');

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

module.exports = router;
