const db = require("../../models");
const config = require("../../config/auth.config");
const { user: User, role: Role, refreshToken: RefreshToken } = db;

const Op = db.Sequelize.Op;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.verficationCodeStatus = (req, res,next) => {
  // update verfication code statuse

      if (!req.body.phonenumber) { 
        return res.status(404).send({ message: "phone number missing." });
      }
      User.update({
        ...{
          verification_code: "0",
          verification_code_status: "confirmed"
        }
      },
        {
          where: {
            phonenumber: req.body.phonenumber
          }
        }).then(async (user) => {
          if (!user) {
            return res.status(404).send({ message: "User Not found." });
          }
          if (user) {
            User.findOne({
              where: {
                phonenumber: req.body.phonenumber
              }
            }).then((user) => {
    
              if (!user) {
                return res.status(403).send({
                  message: "Invalid User"
                });
              }
    
              if (user) {
                return res.status(200).send({
                  id: user.id,
                  username: user.username,
                  email: user.email
                });
    
              }
    
    
    
            });
    
          }
    
        }).catch(err => {
          return res.status(500).send({ message_at_verify: err.message });
        });
      

};


exports.newPasswordRequestStatus = (req, res, next) => {
  // Save User to Database

  if (!req.body.phonenumber) {
    return res.status(404).send({ message: "phone number missing." });
  }
    User.update({
      ...{
        reset_verification_code: "0",
        reset_verification_code_status: "confirmed"
      }
    },
      {
        where: {
          phonenumber: req.body.phonenumber
        }
      }).then(async (user) => {
        if (!user) {
          return res.status(404).send({ message: "error on verfication code." });
        }
        if (user) {
  
          next();
  
        }
  
      }).catch(err => {
        return res.status(500).send({ message_at_resetverify: err.message });
      });
  
  


};
