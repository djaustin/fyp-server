const router = require('express').Router({mergeParams: true});
const clientController = require('app/controllers/client');

router.get('/', clientController.getUserClients)

module.exports = router;
