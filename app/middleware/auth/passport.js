const passport = require("passport");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const db = require("../../models");
const { Op } = require("sequelize");

const { user: User, role: Role, refreshToken: RefreshToken } = db;
const secretKey = process.env.SECRET_KEY || '';

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: secretKey,
};

passport.use(
  new JwtStrategy(
    options, 
    (jwt_payload, done) => {
      const currentTime = Date.now() / 1000;

      console.log("jwt_payload.exp")
      console.log(jwt_payload.exp && jwt_payload.exp < currentTime)
        // Check if the token has expired
  if (jwt_payload.exp && jwt_payload.exp < currentTime) {

    return done(null, false, { message: 'Token has expired' });
  }
    User.findByPk(jwt_payload.id).then((user) => {
      if (user) {
       // console.log(user) 
        done(null, user);
      } else {
        done(null, false);
      }
    });
  })
);




const clientID = process.env.GOOGLE_CLIENT_ID || ''
const clientSecret = process.env.GOOGLE_CLIENT_SECRET || ''
const callbackURL = process.env.GOOGLE_CALLBACK_URL || ''
passport.use(
  new GoogleStrategy({ 
    clientID: clientID,
    clientSecret: clientSecret,
    callbackURL:callbackURL
  }, 
  function(accessToken, refreshToken, profile, done) {
 //   console.log(profile)
    profile.roles = ['admin','user']
    User.findOne({
      where: {
        [Op.or]: [
          { google_id: profile.id },
          { email: profile.emails[0].value }
        ]
      }
    }).then(user => { 
      if (user) {
      //  console.log(profile)
        // user already exists, do something with user
        return done(null, user);
      } else {
        // user does not exist, create new user
        User.create({
            fullname: profile.displayName,
            username:profile.emails[0].value.replace("@gmail.com", ""),
            email: profile.emails[0].value,
            phonenumber: 0,
            verification_code_status: "confirmed",
            google_id: profile.id,
            googleToken: accessToken,
            google_email: profile.emails[0].value,
            // other fields you want to set for the new user
          }).then(newUser => {
            if (profile.roles) {
              Role.findAll({
                where: {
                  name: {
                    [Op.or]: profile.roles
                  }
                }
              }).then(roles => {
                newUser.setRoles(roles).then(() => {
                  return done(null, newUser);
                });
              });
            }
            else {
              // user role = 1
              user.setRoles([1]).then(() => {
                return done(null, newUser);
              });
            }
             // console.log(newUser)

            // do something with the new user
           
          }).catch(err => {
            return done(err);
          });
          
      }
    }).catch(err => {
      return done(err);
    });
  }
));


passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  
  // deserialize user from session
  passport.deserializeUser((id, done) => {
    User.findByPk(id).then(user => {
      done(null, user);
    }).catch(err => {
      done(err);
    });
  });

module.exports = passport;
