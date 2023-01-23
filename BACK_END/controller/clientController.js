
const { PrismaClient, prisma } = require('@prisma/client')

const { client } = new PrismaClient()

//AJOUT
exports.createClient = async (req, res, next) => {
    // Perform seeding operations here
    //Véhicule
    try {
      const clients = await client.create({
        data: {
          NomClient: req.body.nomclient,
          PrenomsClient: req.body.prenomsclient,
          UsernameClient: req.body.usernameclient,
          PwdClient: req.body.pwdclient,
          EmailClient: req.body.emailclient,
        }
      })
      console.log(clients)
      res.status(200).json(clients)
  
    } catch (error) {
      console.log(error)
      res.status(500).json(error)
    } 
    
}

//FINDALL
exports.findAllClient = async (req, res, next) => {
    try {
      const clients = await client.findMany();
      console.log(clients)
      res.status(200).json(clients)
    } catch (error) {
      console.log(error)
      res.status(500).json(error)
    }
}

//FINDONE
exports.findOneClient = async (req, res, next) => {
    try {
      const clients = await client.findUnique({
        where :{
          IdClient: +req.params.idclient
        }
      });
      console.log(clients)
      res.status(200).json(clients)
    } catch (error) {
      console.log(error)
      res.status(500).json(error)
    }
}

//UPDATE
exports.updateClient = async (req, res, next) => {
    try {
      req.body.IdClient = +req.body.IdClient
      const clients = await client.update({
        where :{
          IdClient: req.body.IdClient
        },
        data :{
          ...req.body
        }
      });
      console.log(clients)
      res.status(200).json(clients)
    } catch (error) {
      console.log(error)
      res.status(500).json(error)
    }
}

//DELETE
exports.deleteClient = async (req, res, next) => {
    try {
      const clients = await client.delete({
        where :{
          IdClient: +req.params.IdClient
        },
      })
      console.log('supprimé')
      res.status(200).json(clients)
    } catch (error) {
      console.log(error)
      res.status(500).json(error)
    }
}

