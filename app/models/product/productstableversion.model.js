module.exports = (sequelize, Sequelize) => {
  const ProductsTableVersion = sequelize.define("productsTableVersion", {
    productGroupIds: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    version: {
      type: Sequelize.FLOAT,
      allowNull: false,
      defaultValue: 0.1, // Set the default value to 0.1
    },
  });

  return ProductsTableVersion;
};
