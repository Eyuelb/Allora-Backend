const db = require("../../models");
const config = require("../../config/auth.config");
const { verification } = require("../../middleware");
const { user: User, role: Role, refreshToken: RefreshToken } = db;

const Op = db.Sequelize.Op;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.signup = (req, res) => {
  // Save User to Database
  User.create({
    fullname: req.body.fullname,
    username: req.body.username,
    gender: req.body.gender,
    phonenumber: req.body.phonenumber,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8),
    verification_code: verification.createVerificationCode,
    verification_code_status: "pending",

  }).then(user => {
      if (req.body.roles) {
        Role.findAll({
          where: {
            name: {
              [Op.or]: req.body.roles
            }
          }
        }).then(roles => {
          user.setRoles(roles).then(() => {
            return res.send({ message: "User registered successfully!" ,
            phonenumber: user.phonenumber,code: user.verification_code  }); 
          });
        });
      } else {
        // user role = 1
        user.setRoles([1]).then(() => {
       return res.send({ message: "User registered successfully!" ,
          username: user.phonenumber,code: user.verification_code  }); 
        });
      }
    }).catch(err => {
      res.status(500).send({ message: err.message });
    });
};

exports.signin = (req, res) => {

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
            User.findOne({
              where: {
                phonenumber: req.body.phonenumber
              }
            })
              .then(async (user) => {
                if (!user) {
                  return res.status(404).send({ message: "User Not found." });
                }
          
                const passwordIsValid = bcrypt.compareSync(
                  req.body.password,
                  user.password
                );
          
                if (!passwordIsValid) {
                  return res.status(401).send({
                    accessToken: null,
                    message: "Invalid Password!"
                  });
                }
          
                const token = jwt.sign({ id: user.id }, config.secret, {
                  expiresIn: config.jwtExpiration
                });
          
                let refreshToken = await RefreshToken.createToken(user);
          
                let authorities = [];
                user.getRoles().then(roles => {
                  for (let i = 0; i < roles.length; i++) {
                    authorities.push("ROLE_" + roles[i].name.toUpperCase());
                  }
          
                  return res.status(200).send({
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    roles: authorities,
                    accessToken: token,
                    refreshToken: refreshToken,
                  });
                });
              })
              .catch(err => {
                res.status(500).send({ message: err.message });
              });
          }
      });
  
  
};

exports.refreshToken = async (req, res) => {
  const { refreshToken: requestToken } = req.body;

  if (requestToken == null) {
    return res.status(403).json({ message: "Refresh Token is required!" });
  }

  try {
    let refreshToken = await RefreshToken.findOne({ where: { token: requestToken } });

    console.log(refreshToken)

    if (!refreshToken) {
      res.status(403).json({ message: "Refresh token is not in database!" });
      return;
    }

    if (RefreshToken.verifyExpiration(refreshToken)) {
      RefreshToken.destroy({ where: { id: refreshToken.id } });
      
      res.status(403).json({
        message: "Refresh token was expired. Please make a new signin request",
      });
      return;
    }

    const user = await refreshToken.getUser();
    let newAccessToken = jwt.sign({ id: user.id }, config.secret, {
      expiresIn: config.jwtExpiration,
    });

    return res.status(200).json({
      accessToken: newAccessToken,
      refreshToken: refreshToken.token,
    });
  } catch (err) {
    return res.status(500).send({ message: err });
  }
};