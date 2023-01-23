const { PrismaClient, prisma } = require("@prisma/client");
const { utilisateur } = new PrismaClient();
const {send_mail} = require("../tools/send_mail");
var moment = require('moment');
moment.locale('fr'); // 'fr'

const { cars } = new PrismaClient();
const { sendError, sendResponse } = require('./baseController')


//AJOUT
exports.createVoiture = async (req, res, next) => {
  // Perform seeding operations here
  //Véhicule
  //Destructing
  let { Matricule, Marque , Version , EtatVehicule, PoidsVehicule,PoidsColis,Amorcage,DateArriveeAuPort, isNotify} = req.body
  console.log('isNotify',isNotify);
  console.log('typeof isNotify',typeof isNotify);
  DateArriveeAuPort = new Date(DateArriveeAuPort)
  try {
    const car = await cars.create({
      data: {
        Matricule,Marque,Version,EtatVehicule,PoidsVehicule,PoidsColis,Amorcage,DateArriveeAuPort
      },
    });
    console.log(car);
    
    //sendMail
    if(car){
      if(isNotify){
        const users = await user_to_notify()
        send_mail(
          users,
          "SMMC PORT TOAMASINA | COTATION DE MANUTENTION DE VEHICULE",
          `<p>Un nouveau véhicule est actuellement disponible au sein du Port Toamasina <br>
  
          <strong> MARQUE : ${car.Marque}</strong> <br>
          <strong> VERSION : ${car.Version}</strong> <br>
          <strong> DATE D'ARRIVEE : ${moment(car.DateArriveeAuPort).format('LLLL')}</strong> <br><br>
          </p><br><br><p>Vous pouvez le consulter à tout moment !</p>`
        );
        message = `Ajout avec succès et les clients ont été notifiés via Email !`;
        sendResponse(res, car, message);
      }else{
        message = `Ajout avec succès et les clients n'ont pas été notifiés !`;
        sendResponse(res, car, message);
      }
    }
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


const user_to_notify = async (req, res, next)=>{
  let users = []
   try {

       const email_user = await utilisateur.findMany({
           select:{email:true}
       })

       email_user.forEach((user)=>{
           users.push(user.email)
       })

       return users
   } catch (error) {
       console.log(error);
   }
}
