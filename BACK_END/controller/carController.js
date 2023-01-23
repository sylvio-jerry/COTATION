const { PrismaClient, prisma } = require("@prisma/client");

const { cars } = new PrismaClient();
const { sendError, sendResponse } = require('./baseController')

//AJOUT
exports.createVoiture = async (req, res, next) => {
  // Perform seeding operations here
  //Véhicule
  //Destructing
  let { Matricule, Marque , Version , EtatVehicule, PoidsVehicule,PoidsColis,Amorcage,DateArriveeAuPort} = req.body
  DateArriveeAuPort = new Date(DateArriveeAuPort)
  try {
    const car = await cars.create({
      data: {
        Matricule,Marque,Version,EtatVehicule,PoidsVehicule,PoidsColis,Amorcage,DateArriveeAuPort
      },
    });
    console.log(car);
    // res.status(200).json(car);
    sendResponse(res, car, "Ajout avec succès");
  } catch (error) {
    if(error.code==='P2002') return sendError(res,"Cet Véhicule existe déjà !")
    console.log(error);
    // res.status(500).json(error);
    return sendError(res);
  }
};

exports.findNeuveVoiture = async (req, res, next) => {
  try {
    console.log("mpaaaaaa");
    const car = await cars.findMany({
      where: {
        EtatVehicule: req.params.etatvehicule,
      },
    });
    // res.status(200).json(car);
      sendResponse(res, car, "Find Voiture");
  } catch (error) {
    console.log(error);
    // res.status(500).json(error);
    return sendError(res);
  }
};

//FINDALL
exports.findAllVoiture = async (req, res, next) => {
  try {
    const car = await cars.findMany();
    console.log(car);
    // res.status(200).json(car);
    sendResponse(res, car, "Liste des véhicules");
  } catch (error) {
    console.log(error);
    // res.status(500).json(error);
    sendError(res);
  }
};

//FINDONE
exports.findOneVoiture = async (req, res, next) => {
  try {
    const car = await cars.findUnique({
      where: {
        IdVehicule: +req.params.id,
      },
    });
    console.log(car);
    // res.status(200).json(car);
    sendResponse(res, car, "Info sur le véhicule");
  } catch (error) {
    console.log(error);
    // res.status(500).json(error);
    return sendError(res);
  }
};

//UPDATE
exports.updateVoiture = async (req, res, next) => {
  // Perform seeding operations here
  //Véhicule
  //Destructing
  let { Matricule, Marque , Version , EtatVehicule, PoidsVehicule,PoidsColis,Amorcage,DateArriveeAuPort} = req.body
  DateArriveeAuPort = new Date(DateArriveeAuPort)
  try {
    const car = await cars.update({
      where:{
        IdVehicule : +req.params.id
      },
      data: {
        Matricule,Marque,Version,EtatVehicule,PoidsVehicule,PoidsColis,Amorcage,DateArriveeAuPort
      },
    });
    console.log(car);
    // res.status(200).json(car);
    sendResponse(res, car, "Mise à jour avec succès");
  } catch (error) {
    if(error.code==='P2002') return sendError(res,"Cet Véhicule existe déjà !")
    console.log(error);
    // res.status(500).json(error);
    return sendError(res);
  }
};

//DELETE
exports.deleteVoiture = async (req, res, next) => {
  try {
    const car = await cars.delete({
      where: {
        IdVehicule: +req.params.id,
      },
    });
    // res.status(200).json(car);
    sendResponse(res, car, "Suppression avec succès");
  } catch (error) {
    console.log(error);
    // res.status(500).json(error);
    return sendError(res);
  }
};
