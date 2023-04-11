const { body, validationResult } = require('express-validator');
const passwordValidator = require ('password-validator');
const passwordSchema = new passwordValidator ();
passwordSchema
.is().min(8)                                    // Minimum length 8
.is().max(100)                                  // Maximum length 100                          
.has().digits()                                 // Must have digits
.has().not().spaces()                           // Should not have spaces
.is().not().oneOf(['Passw0rd', 'Password123']);

const authValidation = {
    signup:(req, res, next) => {
        const { fullname, username, gender, phonenumber, email, password } = req.body;
        const errors = [];
      
        // check if fullname is provided and not empty
        if (!fullname || fullname.trim().length === 0) {
          errors.push("Fullname is required");
        }
      
        // check if username is provided and not empty
        if (!username || username.trim().length === 0) {
          errors.push("Username is required");
        }
      
        // check if gender is provided and is either "male" or "female"
        if (!gender || (gender !== "male" && gender !== "female")) {
          errors.push("Gender is required and should be either male or female");
        }
      
        // check if phonenumber is provided and is valid (10 digits)
        if (!phonenumber || !/^\d{10}$/.test(phonenumber)) {
          errors.push("Phonenumber is required and should be a valid 10-digit number");
        }
      
        // check if email is provided and is valid
        if (!email || !/\S+@\S+\.\S+/.test(email)) {
          errors.push("Email is required and should be a valid email address");
        }
      
        // check if password is provided and is at least 8 characters long
        if (!password || passwordSchema.validate (password)) {
          errors.push("Password is required and should be at least 8 characters long");
        }
      
        if (errors.length > 0) {
          return res.status(400).json({ errors });
        }
      
        next();
    }

}
module.exports = authValidation