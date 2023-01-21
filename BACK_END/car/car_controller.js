const { PrismaClient, prisma } = require("@prisma/client");

const { cars } = new PrismaClient();

//AJOUT
exports.createVoiture = async (req, res, next) => {
  // Perform seeding operations here
  //Véhicule
  try {
    const car = await cars.create({
      data: {
        Matricule: req.body.matricule,
        Marque: req.body.marque,
        Version: req.body.version,
        EtatVehicule: req.body.etatvehicule,
        PoidsVehicule: +req.body.poidsvehicule,
        PoidsColis: +req.body.poidscolis,
        Amorcage: +req.body.amorcage,
        DateArriveeAuPort: new Date(req.body.datearr),
      },
    });
    console.log(car);
    res.status(200).json(car);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
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
    res.status(200).json(car);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

//FINDALL
exports.findAllVoiture = async (req, res, next) => {
  try {
    const car = await cars.findMany();
    console.log(car);
    res.status(200).json(car);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

//FINDONE
exports.findOneVoiture = async (req, res, next) => {
  try {
    const car = await cars.findUnique({
      where: {
        IdVehicule: +req.params.idvehicule,
      },
    });
    console.log(car);
    res.status(200).json(car);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

//UPDATE
exports.updateVoiture = async (req, res, next) => {
  try {
    if (req.body.PoidsVehicule) {
      req.body.PoidsVehicule = +req.body.PoidsVehicule;
    }
    if (req.body.IdVehicule) {
      req.body.IdVehicule = +req.body.IdVehicule;
    }
    if (req.body.DateArriveeAuPort) {
      req.body.DateArriveeAuPort = new Date(req.body.DateArriveeAuPort);
      console.log(req.body.DateArriveeAuPort);
    }
    const car = await cars.update({
      where: {
        IdVehicule: req.body.IdVehicule,
      },
      data: {
        ...req.body,
      },
    });
    console.log(car);
    res.status(200).json(car);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

//DELETE
exports.deleteVoiture = async (req, res, next) => {
  try {
    const car = await cars.delete({
      where: {
        IdVehicule: +req.params.IdVehicule,
      },
    });
    res.status(200).json(car);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};
