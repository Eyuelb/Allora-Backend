module.exports = (sequelize, Sequelize) => {
  const ManufacturingCountry = sequelize.define("manufacturingCountrys", {
    manufacturingCountryName: {
      type: Sequelize.STRING,
      //allowNull: false
    },
    manufacturingCountryDescription: {
      type: Sequelize.STRING,
      //allowNull: false
    },
    manufacturingCountryImage: {
      type: Sequelize.STRING,
      //allowNull: false
    },
    manufacturingCountryVisibility: {
      type: Sequelize.BOOLEAN,
      defaultValue: true,
    },
    createdby: {
        type: Sequelize.STRING,
       // allowNull: false
    },
    updatedby: {
        type: Sequelize.STRING,
        // allowNull defaults to true
    },
  });

  return ManufacturingCountry;
};
