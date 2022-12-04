const db = require("../../models");
const { verification } = require("../../middleware");
const { user: User, role: Role, refreshToken: RefreshToken } = db;

const Op = db.Sequelize.Op;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");


exports.resetpassword = (req, res) => {
  User.findByPk(req.userId).then( (user) => {

    if (!user) {
        return res.status(404).send({ message: "User Not found." });
    }

    if (user) {
      User.update({ ...{ 
          password: bcrypt.hashSync(req.body.new_password, 8), } }, 
          {
          where: {
              phonenumber: user.phonenumber
          }
          
      }).then(async () => {
        if (!user) {
          return res.status(404).send({ message: "User Not found async." });
        }
        if(user){
          User.findOne({
            where: {
              phonenumber: user.phonenumber
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
            return res.status(500).send({ message1: err.message });
          });
      
        }
        
          }).catch(err => {
            return res.status(500).send({ message2: err.message });
          });
  }
}).catch(err => {
  return res.status(500).send({ message3: err.message });
});    
    
};