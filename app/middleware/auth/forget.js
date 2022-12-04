const db = require("../../models");
const User = db.user;

checkUserexist = (req, res, next) => {

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
            next();
        }
    });

    
};


checknewpassword = (req, res, next) => {

    if (!req.body.code) {
        return res.status(404).send({ message: "invalid password reset." });
    }
    if (!req.body.new_password) {
        return res.status(404).send({ message: "invalid password reset." });
    }
    if (!req.body.re_enter_password) {
        return res.status(404).send({ message: "invalid password reset." });
    }
    if (req.body.new_password !== req.body.re_enter_password) {
        return res.status(404).send({ message: "password dont match." });
    }


    next();


};




const forget = {
    checkUserexist: checkUserexist,
    checknewpassword:checknewpassword
};

module.exports = forget;
