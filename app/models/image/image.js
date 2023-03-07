
module.exports = (sequelize, Sequelize) => {
    const ProductImage = sequelize.define("productImages", {
          name: {
            type: Sequelize.STRING,
            allowNull: false,
          },
          type: {
            type: Sequelize.STRING,
            allowNull: false,
          },
          size: {
            type: Sequelize.INTEGER,
            allowNull: false,
          },
          iv: {
            type: Sequelize.STRING(32),
            allowNull: false,
          },
          data: {
            type: Sequelize.BLOB,
            allowNull: false,
          },
    });
  
    return ProductImage;
  };
   