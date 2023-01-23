var express = require("express");
const app = require("../app");
var router = express.Router();

const voiture = require('../controller/carController')
/* POST home page. */
router.post("/create", voiture.createVoiture);
router.get("/findAll", voiture.findAllVoiture);
router.get("/findOne/:id", voiture.findOneVoiture);
router.get("/find/:etatvehicule", voiture.findNeuveVoiture);
router.put("/update/:id", voiture.updateVoiture);
router.delete("/delete/:id", voiture.deleteVoiture);

module.exports = router;
