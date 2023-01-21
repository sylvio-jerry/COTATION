
var express = require('express');
const app = require('../app');
var router = express.Router();

const adminamroute = require ('./admin_controller')
/* POST home page. */
router.post('/create', adminamroute.createAdmin );
router.get('/findAll', adminamroute.findAllAdmin );
router.get('/findOne/:idadmin', adminamroute.findOneAdmin );
router.post('/updateAdmin', adminamroute.updateAdmin );
router.delete('/deleteAdmin/:IdAdmin', adminamroute.deleteAdmin);

module.exports = router;