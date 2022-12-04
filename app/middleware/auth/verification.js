
const db = require("../../models");
const User = db.user;

const createVerificationCode = () => {
  var minm = 100000;
  var maxm = 999999;
  return Math.floor(Math
    .random() * (maxm - minm + 1)) + minm;
}



checkVerificationCodeStatus = (req, res, next) => {
 
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
        if (user.verification_code_status === "confirmed") {
          next();
          return;
        }
        if (user.verification_code_status === "pending") {
          return res.status(403).send({
            message: "waiting for confirmation"
          });
        }

      }
    }).catch(err => {
      return res.status(500).send({ message_at_checkVerificationCodeStatus: err.message });
    });

};


updateVerificationCodeStatus = (req, res, next) => {

  if (!req.body.phonenumber) {
    return res.status(404).send({ message: "phone number missing." });
  }

  User.findOne({
    where: {
      phonenumber: req.body.phonenumber,
    }
  }).then(user => {
    if (!user) {
      return res.status(403).send({
        message: "Invalid User"
      });
    }

    if (user) {

      if (user.verification_code_status === "confirmed") {
        return res.status(403).send({
          message: "Already confirmed account"
        });
      }
      if (user.verification_code === req.body.code) {
        if (user.verification_code_status === "pending") {
          next();
          return;
        }

      }
      else {

        return res.status(403).send({
          message: "Invalid VerificationCode"
        });

      }

    }


  }).catch(err => {
    return res.status(500).send({ message_at_updateVerificationCodeStatus: err.message });
  });
  

};


checkResetVerificationCodeStatus = (req, res, next) => {

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
          if (user.reset_verification_code_status === "confirmed") {
            return res.status(403).send({
              message: "code already applyed"
            });

          }
          if (user.reset_verification_code_status === "pending") {
            next();
          }
          if (user.reset_verification_code_status === null) {
            return res.status(403).send({
              message: "no password reset request found"
            });
          }

        }
      }).catch(err => {
        return res.status(500).send({ message_at_checkResetVerificationCodeStatus: err.message });
      });
    

    
    }


updateResetVerificationCodeStatus = (req, res, next) => {



    if (!req.body.phonenumber) {
      return res.status(404).send({ message: "phonenumber missing." });
    }
      User.findOne({
        where: {
          phonenumber: req.body.phonenumber,
        }
      }).then(user => {
        if (!user) {
          return res.status(403).send({
            message: "Invalid User"
          });
        }

        if (user) {

          if (user.reset_verification_code_status === "confirmed") {
            return res.status(403).send({
              message: "Already confirmed account"
            });
          }
          if (user.reset_verification_code === req.body.code) {
            if (user.reset_verification_code_status === "pending") {
              next();
              return;
            }

          }
          else {

            return res.status(403).send({
              message: "Invalid VerificationCode"
            });

          }

        }


      }).catch(err => {
        return res.status(500).send({ message_at_updateResetVerificationCodeStatus: err.message });
      });
}
    
    





const verificationCode = {
  createVerificationCode: createVerificationCode(),
  checkVerificationCodeStatus: checkVerificationCodeStatus,
  updateVerificationCodeStatus: updateVerificationCodeStatus,
  checkResetVerificationCodeStatus: checkResetVerificationCodeStatus,
  updateResetVerificationCodeStatus: updateResetVerificationCodeStatus
};
module.exports = verificationCode;
