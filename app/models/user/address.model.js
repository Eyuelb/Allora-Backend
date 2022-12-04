module.exports = (sequelize, Sequelize) => {
  const Address = sequelize.define("addresses", {
    address1: {
      type: Sequelize.STRING,
    //  allowNull: false
    },
    address2: {
      type: Sequelize.STRING,
     // allowNull: false
    },
    city: {
      type: Sequelize.STRING,
     // allowNull: false
    },
    state: {
      type: Sequelize.STRING,
     // allowNull: false
    },
    zip: { 
      type: Sequelize.STRING,
    //  allowNull: false
    },
    country: {
      type: Sequelize.STRING
      // allowNull defaults to true
    },
  });

  return Address;
};
