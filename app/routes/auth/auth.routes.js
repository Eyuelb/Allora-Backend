const { signUp , signIn, verification , forget , reset , authJwt} = require("../../middleware");
const { auth_controller,verify_controller,forget_controller,reset_controller} = require("../../controllers");
const requestlimiter = require("../../ratelimiters/ratelimiter");
//const auth_controller = require("../controllers/auth.controller");
//const verify_controller = require("../auth/controllers/verify.controller");
//const forget_controller = require("../auth/controllers/forget.controller");
//const reset_controller = require("../auth/controllers/reset.controller");
module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post("/api/auth/signup",
  [
    requestlimiter.createAccountLimiter,
    signUp.checkDuplicateUser,
    signUp.checkRolesExisted
  ],
  [
    auth_controller.signup
  ]
  );

  app.post("/api/auth/signin", 
  [
    signIn.checkUserexist,
    verification.checkVerificationCodeStatus
  ],
  [
    auth_controller.signin
  ]
  );

  app.post("/api/auth/verify",
  [
    verification.updateVerificationCodeStatus
  ],
  [
    verify_controller.verficationCodeStatus
  ]
  );

  app.post("/api/auth/forgetpassword",
  [
    requestlimiter.forgotPasswordLimiter,
    forget.checkUserexist
  ],
  [
    forget_controller.forgetpassword
  ]
  );



  app.post("/api/auth/insertnewpassword",
  [
    forget.checkUserexist,
    forget.checknewpassword,
    verification.checkResetVerificationCodeStatus,
    verification.updateResetVerificationCodeStatus
  ],
  [
    verify_controller.newPasswordRequestStatus,
    forget_controller.inserpassword
  ]);



  app.post("/api/auth/resetpassword",
  [
    authJwt.verifyToken,
    reset.checkResetpassword
  ],
  [
    reset_controller.resetpassword
  ]);

  app.post("/api/auth/refreshtoken", auth_controller.refreshToken);
};
 