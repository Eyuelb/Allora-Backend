module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define("users", {
    fullname: {
      type: Sequelize.STRING
    },
    username: {
      type: Sequelize.STRING
    },
    gender: {
      type: Sequelize.STRING,
    //  allowNull: false
    },
    phonenumber: {
      type: Sequelize.STRING,
     // allowNull: false
    },
    email: {
      type: Sequelize.STRING,
     // allowNull: false
    },
    password: {
      type: Sequelize.STRING,
     // allowNull: false
    },
    verification_code: { 
      type: Sequelize.STRING,
    //  allowNull: false
    },
    verification_code_status: {
      type: Sequelize.STRING
      // allowNull defaults to true
    },
    reset_verification_code: { 
      type: Sequelize.STRING,
    //  allowNull: false
    },
    reset_verification_code_status: {
      type: Sequelize.STRING
      // allowNull defaults to true
    },
  });

  return User;
};
