module.exports = (sequelize, Sequelize) => {
  const Brand = sequelize.define("brands", {
    brandName: {
      type: Sequelize.STRING,
      //allowNull: false
    },
    brandDescription: {
      type: Sequelize.STRING,
      //allowNull: false
    },
    brandCategory: {
      type: Sequelize.STRING,
      defaultValue: '0',
      //allowNull: false
    },
    brandImage: {
      type: Sequelize.STRING,
      //allowNull: false
    },
    brandVisibility: {
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

  return Brand;
};
