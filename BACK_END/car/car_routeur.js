var express = require("express");
const app = require("../app");
var router = express.Router();

const voiture = require("./car_controller");
/* POST home page. */
router.post("/create", voiture.createVoiture);
router.get("/findAll", voiture.findAllVoiture);
router.get("/findOne/:idvehicule", voiture.findOneVoiture);
router.get("/find/:etatvehicule", voiture.findNeuveVoiture);
router.post("/updateVoiture", voiture.updateVoiture);
router.delete("/deleteVoiture/:IdVehicule", voiture.deleteVoiture);

module.exports = router;
