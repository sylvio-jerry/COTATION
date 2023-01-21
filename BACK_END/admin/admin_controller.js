
const { PrismaClient, prisma } = require('@prisma/client')

const { admin } = new PrismaClient()

//AJOUT
exports.createAdmin = async (req, res, next) => {
    // Perform seeding operations here
    //Véhicule
    try {
      const admins = await admin.create({
        data: {
          NomAdmin: req.body.nomadmin,
          PrenomsAdmin: req.body.prenomsadmin,
          UsernameAdmin: req.body.usernameadmin,
          PwdAdmin: req.body.pwdadmin,
          EmailAdmin: req.body.emailadmin,
        }
      })
      console.log(admins)
      res.status(200).json(admins)
  
    } catch (error) {
      console.log(error)
      res.status(500).json(error)
    } 
    
}

//FINDALL
exports.findAllAdmin = async (req, res, next) => {
    try {
      const admins = await admin.findMany();
      console.log(admins)
      res.status(200).json(admins)
    } catch (error) {
      console.log(error)
      res.status(500).json(error)
    }
}

//FINDONE
exports.findOneAdmin = async (req, res, next) => {
    try {
      const admins = await admin.findUnique({
        where :{
          IdAdmin: +req.params.idadmin
        }
      });
      console.log(admins)
      res.status(200).json(admins)
    } catch (error) {
      console.log(error)
      res.status(500).json({error:error})
    }
}

//UPDATE
exports.updateAdmin = async (req, res, next) => {
    try {
      req.body.IdAdmin = +req.body.IdAdmin
      const admins = await admin.update({
        where :{
          IdAdmin: req.body.IdAdmin
        },
        data :{
          ...req.body
        }
      });
      console.log(admins)
      res.status(200).json(admins)
    } catch (error) {
      console.log(error)
      res.status(500).json(error)
    }
}

//DELETE
exports.deleteAdmin = async (req, res, next) => {
    try {
      const admins = await admin.delete({
        where :{
          IdAdmin: +req.params.IdAdmin
        },
      })
      console.log('supprimé')
      res.status(200).json(admins)
    } catch (error) {
      console.log(error)
      res.status(500).json(error)
    }
}