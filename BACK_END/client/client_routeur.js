
var express = require('express');
const app = require('../app');
var router = express.Router();

const clientamroute = require ('./client_controller')
/* POST home page. */
router.post('/create', clientamroute.createClient );
router.get('/findAll', clientamroute.findAllClient );
router.get('/findOne/:idclient', clientamroute.findOneClient );
router.post('/updateClient', clientamroute.updateClient );
router.delete('/deleteClient/:IdClient', clientamroute.deleteClient);

module.exports = router;