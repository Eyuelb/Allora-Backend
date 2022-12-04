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
    


    

   // return res.status(404).send({ message: "error." });

};





const signin = {
    checkUserexist: checkUserexist
};

module.exports = signin;
