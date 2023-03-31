const { v4: uuidv4 } = require('uuid');

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
      type: Sequelize.FLOAT,
      //allowNull: false
    },
    productPreviousPrice: {
      type: Sequelize.FLOAT,
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
    productMainImageID: {
      type: Sequelize.STRING,
      //allowNull: false
    },
    productAdditionalImagesID: {
      type: Sequelize.ARRAY(Sequelize.STRING),
      //allowNull: false
    },
    productVisibility: {
      type: Sequelize.BOOLEAN,
      defaultValue: true,
    },
    productGroupId: {
      type: Sequelize.STRING,
      allowNull: true,
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
  // Product.beforeCreate(async (product, options) => {


  //   const batchSize = 20;
  //   const productsCount = await Product.count();
  //   const lastGroupCount = productsCount % batchSize;
  
  //   if (lastGroupCount === batchSize - 1) {
  //     // Generate a new product group ID
  //     const newGroupId = uuidv4();
  //     product.productGroupId = newGroupId;
  //   } else {
  //     // Get the last product group ID
  //     const lastProduct = await Product.findOne({
  //       order: [['id', 'DESC']],
  //     });
  
  //     if (lastProduct) {
  //       product.productGroupId = lastProduct.productGroupId;
  //     }
  //   }
  // });
    Product.beforeCreate(async (product, options) => {


    const batchSize = 20;
          // Get the last product group ID
      const lastProduct = await Product.findOne({
            order: [['id', 'DESC']],
          });
          console.log(lastProduct.productGroupId)
      const { count } = await Product.findAndCountAll({
            where: {
              productGroupId: lastProduct.productGroupId
          }
          });
          console.log(count)

    if(count >= batchSize){
      const newGroupId = uuidv4();
      product.productGroupId = newGroupId;
    } else {

      product.productGroupId = lastProduct.productGroupId;
    }
  });
  return Product;
};
