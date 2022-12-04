const authJwt = require("./auth/authJwt");
const signUp = require("./auth/signUp");
const verification = require("./auth/verification");
const access = require("./auth/access");
const forget = require("./auth/forget");
const signIn = require("./auth/signIn");
const reset = require("./auth/reset");
const order = require("./order/order");
module.exports = {
  authJwt,
  signUp,
  signIn,
  verification,
  access,
  forget,
  reset,
  order
  
};
