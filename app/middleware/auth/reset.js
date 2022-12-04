const db = require("../../models");
const User = db.user;

checkResetpassword = (req, res, next) => {

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

const reset = {
    checkResetpassword: checkResetpassword
};

module.exports = reset;
