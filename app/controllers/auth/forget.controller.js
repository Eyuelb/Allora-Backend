const db = require("../../models");
const { verification } = require("../../middleware");
const { user: User, role: Role, refreshToken: RefreshToken } = db;

const Op = db.Sequelize.Op;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.forgetpassword = (req, res) => {

  // Save User to Database
    if (!req.body.phonenumber) {
      
    return res.status(404).send({ message: "phonenumber missing." });
    }
        User.findOne({
            where: {
                phonenumber: req.body.phonenumber
            }
        }).then(user => {
            if (!user) {
                return res.status(404).send({ message: "User Not found." });
            }
    
            if (user) {
                User.findOne({
                    where: {
                        phonenumber: req.body.phonenumber
                    }
                }).then(user => {
                    if (!user) {
                        return res.status(404).send({ message: "User Not found." });
                    }
            
                    if (user) {
                        User.update({ ...{ 
                            reset_verification_code: verification.createVerificationCode, 
                            reset_verification_code_status: "pending" } }, 
                            {
                            where: {
                                phonenumber: req.body.phonenumber
                            }
                        }).then(async (user) => {
                          if (!user) {
                            return res.status(404).send({ message: "User Not found." });
                          }
                          if(user){
                            User.findOne({
                              where: {
                                phonenumber: req.body.phonenumber
                              }
                            }).then( (user) => {
                          
                              if(!user){
                                return  res.status(403).send({
                                  message: "Invalid User"
                                });
                              }
                          
                              if(user){
                                return res.status(200).send({
                                  id: user.id,
                                  username: user.username,
                                  email: user.email,
                                  phonenumber:user.phonenumber,
                                  code:user.reset_verification_code
                                });
                          
                              } 
                          
                          
                            
                            });
                        
                          }
                          
                            }).catch(err => {
                              return res.status(500).send({ message: err.message });
                            });
                    }
                });
            }
        });
    
};

exports.inserpassword = (req, res) => {

  // Save User to Database
    if (!req.body.phonenumber) {
      return res.status(404).send({ message: "phone number missing." });
    }
        User.findOne({
            where: {
                phonenumber: req.body.phonenumber
            }
        }).then(user => {
            if (!user) {
                return res.status(404).send({ message: "User Not found." });
            }
    
            if (user) {
              User.update({ ...{ 
                  password: bcrypt.hashSync(req.body.new_password, 8), } }, 
                  {
                  where: {
                      phonenumber: req.body.phonenumber
                  }
              }).then(async (user) => {
                if (!user) {
                  return res.status(404).send({ message: "User Not found." });
                }
                if(user){
                  User.findOne({
                    where: {
                      phonenumber: req.body.phonenumber
                    }
                  }).then( (user) => {
                
                    if(!user){
                      return  res.status(403).send({
                        message: "Invalid User"
                      });
                    }
                
                    if(user){
                      return res.status(200).send({
                        id: user.id,
                        username: user.username,
                        email: user.email,
                        phonenumber:user.phonenumber
                      });
                
                    } 
              
                  }).catch(err => {
                    return res.status(500).send({ message: err.message });
                  });
              
                }
                
                  }).catch(err => {
                    return res.status(500).send({ message: err.message });
                  });
          }
        }).catch(err => {
          return res.status(500).send({ message: err.message });
        });
    
    
};