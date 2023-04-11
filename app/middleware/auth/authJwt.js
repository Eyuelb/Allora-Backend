const passport = require("./passport");

const authJwt = {
  verifyToken: passport.authenticate('jwt', { session: false }),
};
module.exports = authJwt;

// const jwt = require("jsonwebtoken");
// const config = require("../../config/auth.config.js");
// const { TokenExpiredError } = jwt;

// const catchError = (err, res) => {
//   if (err instanceof TokenExpiredError) {
//     return res.status(401).send({ message: "Unauthorized! Access Token was expired!" });
//   }

//   return res.sendStatus(401).send({ message: "Unauthorized!" });
// }

// const verifyToken = (req, res, next) => {
//   let token = req.headers["x-access-token"];

//   if (!token) {
//     return res.status(403).send({ message: "No token provided!" });
//   }

//   jwt.verify(token, config.secret, (err, decoded) => {
//     if (err) {
//       return catchError(err, res);
//     }
//     req.userId = decoded.id; 
//     next();
//   });
// };

// Set up Socket.io with JWT authentication







// const authJwt = {
//   verifyToken: verifyToken,
// };
// module.exports = authJwt;
// const passport = require('passport');
// const JwtStrategy = require('passport-jwt').Strategy;
// const ExtractJwt = require('passport-jwt').ExtractJwt;
// const config = require("../../config/auth.config.js");
// const db = require("../../models");
// const User = db.user;

// const options = {
//   jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
//   secretOrKey: config.secret
// };
// console.log(options.jwtFromRequest)

// passport.use(new JwtStrategy(options, function(jwt_payload, done) {
//   check if the user exists in the database
//   console.log(jwt_payload)
//   User.findById(jwt_payload.id, function(err, user) {
//     if (err) {
//       return done(err, false);
//     }
//     if (user) {
//       return done(null, user);
//     } else {
//       return done(null, false);
//     }
//   });
// }));

// const authJwt = {
//   verifyToken: passport.authenticate('jwt', { session: false }),
// };
// module.exports = authJwt;
