const db = require("../../models");
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
          return res.send({
            message: "User registered successfully!",
            phonenumber: user.phonenumber, code: user.verification_code
          });
        });
      });
    } else {
      // user role = 1
      user.setRoles([1]).then(() => {
        return res.send({
          message: "User registered successfully!",
          phonenumber: user.phonenumber, code: user.verification_code
        });
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
          const jwtExpiration = process.env.JWT_EXPIRATION | 0 || 15;
          const secretKey = process.env.SECRET_KEY || '';
          //console.log(parseFloat(jwtExpiration))
          const token = jwt.sign({ id: user.id }, secretKey, {
            expiresIn: jwtExpiration,
          });

          let refreshToken = await RefreshToken.createToken(user);
          let authorities = [];
          if (!refreshToken) {
            return res.status(500).send({ message: 'error on refresh Token' });
          }
          user.getRoles().then(roles => {
            for (let i = 0; i < roles.length; i++) {
              authorities.push("ROLE_" + roles[i].name.toUpperCase());
            }
            res.cookie('authToken', token, { httpOnly: true });
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
exports.signinByGoogle = async (req, res) => {

  if (req.user) {
    const user = req.user
    const jwtExpiration = process.env.JWT_EXPIRATION | 0 || 15;
    const secretKey = process.env.SECRET_KEY || '';
    const frontEndURL = process.env.FRONT_END_URL || '';
    const token = jwt.sign({ id: user.id }, secretKey, {
      expiresIn: jwtExpiration,
    });
    let userToken = await RefreshToken.findOne({ where: { userId: user.id } });
    console.log(userToken)
    if (!userToken) {
      userToken = await RefreshToken.createToken(user);
      userToken = await RefreshToken.findOne({ where: { token: userToken } });
    }
   // console.log(userToken)
    if (!!userToken&&RefreshToken.verifyExpiration(userToken)){
      await userToken.destroy();
      userToken = await RefreshToken.createToken(user);
    }
    
    if (!userToken) {
      return res.status(500).send({ message: 'error on refresh Token' });
    }
    let authorities = [];
    user.getRoles().then(roles => {
      for (let i = 0; i < roles.length; i++) {
        authorities.push("ROLE_" + roles[i].name.toUpperCase());
      }
      res.cookie('authToken', token);
      return res.redirect(`${frontEndURL}/?accessKey=${encodeURIComponent(!!userToken.token&&userToken.token ||userToken)}`)
    });
  }

};

exports.signinByGoogleAuthToken = async (req, res) => {
  const { refreshToken } = req.body;
  if (refreshToken == null) {
    return res.status(403).json({ message: "Refresh Token is required!" });
  }
  try {
    let userToken = await RefreshToken.findOne({ where: { token: refreshToken } });

    //console.log(refreshToken)

    if (!userToken) {
      return res.status(403).json({ message: "Refresh token is not in database!" });
    }

    if (RefreshToken.verifyExpiration(userToken)) {
      await userToken.destroy();
      return res.status(403).json({
        message: "Refresh token was expired. Please make a new signin request",
      });
    }

    const jwtExpiration = process.env.JWT_EXPIRATION | 0 || 15;
    const secretKey = process.env.SECRET_KEY || '';
    const user = await userToken.getUser();


    let newAccessToken = jwt.sign({ id: user.id }, secretKey, {
      expiresIn: jwtExpiration,
    });
    let authorities = [];

    user.getRoles().then(roles => {
      for (let i = 0; i < roles.length; i++) {
        authorities.push("ROLE_" + roles[i].name.toUpperCase());
      }
      res.cookie('authToken', newAccessToken);
      return res.status(200).send({
        id: user.id,
        username: user.username,
        email: user.email,
        roles: authorities,
        accessToken: newAccessToken,
        refreshToken: userToken.token,
      });

    });
  } catch (err) {
    return res.status(500).send({ message: err });
  }

}
exports.refreshToken = async (req, res) => {
  const { refreshToken: requestToken } = req.body;

  if (requestToken == null) {
    return res.status(403).json({ message: "Refresh Token is required!" });
  }

  try {
    let refreshToken = await RefreshToken.findOne({ where: { token: requestToken } });

    //console.log(refreshToken)

    if (!refreshToken) {

      return res.status(403).json({ message: "Refresh token is not in database!" });
    }

    if (RefreshToken.verifyExpiration(refreshToken)) {
      await refreshToken.destroy();

      return res.status(403).json({
        message: "Refresh token was expired. Please make a new signin request",
      });
    }

    const jwtExpiration = process.env.JWT_EXPIRATION | 0 || 15;
    const secretKey = process.env.SECRET_KEY || '';
    const user = await refreshToken.getUser();


    let newAccessToken = jwt.sign({ id: user.id }, secretKey, {
      expiresIn: jwtExpiration,
    });

    return res.status(200).json({
      accessToken: newAccessToken,
      refreshToken: refreshToken.token,
    });
  } catch (err) {
    return res.status(500).send({ message: err });
  }
};