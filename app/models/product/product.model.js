module.exports = (sequelize, Sequelize) => {
  const Product = sequelize.define("products", {
    productId: {
      type: Sequelize.STRING,
      //allowNull: false
    },
    productName: {
      type: Sequelize.STRING,
      //allowNull: false
    },
    productShortDescription: {
      type: Sequelize.STRING,
      //allowNull: false
    },
    productFullDescription: {
      type: Sequelize.STRING,
      //allowNull: false
    },
    productCategory: {
      type: Sequelize.STRING,
      //allowNull: false
    },
    productBrand: {
      type: Sequelize.STRING,
      //allowNull: false
    },
    productManufacturingCountry: {
      type: Sequelize.STRING,
      //allowNull: false
    },
    productPrice: {
      type: Sequelize.INTEGER,
      //allowNull: false
    },
    productPreviousPrice: {
      type: Sequelize.INTEGER,
      //allowNull: false
    },
    productQuantity: {
      type: Sequelize.INTEGER,
      //allowNull: false
    },
    productMinimumQuantityAllowed: {
      type: Sequelize.INTEGER,
      //allowNull: false
    },
    productMaximumQuantityAllowed: {
      type: Sequelize.INTEGER,
      //allowNull: false
    },
    productMainImage: {
      type: Sequelize.STRING,
      //allowNull: false
    },
    productAdditionalImages: {
      type: Sequelize.STRING,
      //allowNull: false
    },
    productVisibility: {
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

  return Product;
};
