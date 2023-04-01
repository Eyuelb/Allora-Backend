const {generateId} = require('../utils');

const config = require("../config/db.config.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(
  config.DB,
  config.USER,
  config.PASSWORD,
  {
    host: config.HOST,
    dialect: config.dialect,
    operatorsAliases: false,

    pool: {
      max: config.pool.max,
      min: config.pool.min,
      acquire: config.pool.acquire,
      idle: config.pool.idle
    }
  }
);

const db = {};
 
db.Sequelize = Sequelize;
db.sequelize = sequelize;


db.refreshToken = require("./auth/refreshToken.model.js")(sequelize, Sequelize);

db.cart = require("./cart/cart.model")(sequelize, Sequelize);
db.cartItems = require("./cart/cartItems.model")(sequelize, Sequelize);


db.order = require("./order/order.model")(sequelize, Sequelize);
db.orderStatus = require("./order/orderStatus.model")(sequelize, Sequelize);


db.card = require("./payment/card.model ")(sequelize, Sequelize);
db.cardType = require("./payment/cardType.model")(sequelize, Sequelize);


db.products = require("./product/product.model")(sequelize, Sequelize);
db.productImages = require("./product/productimage.model")(sequelize, Sequelize);
db.productsTableVersion = require("./product/productstableversion.model")(sequelize, Sequelize);




db.brand = require("./product/brand.model")(sequelize, Sequelize);
db.category = require("./product/category.model")(sequelize, Sequelize);
db.manufacturingCountry = require("./product/manufacturingCountry.model")(sequelize, Sequelize);


db.session = require("./session/session.model")(sequelize, Sequelize);

db.discount = require("./discount/discount.model")(sequelize, Sequelize);

db.user = require("./user/user.model.js")(sequelize, Sequelize);
db.role = require("./user/role.model.js")(sequelize, Sequelize);
db.address = require("./user/address.model")(sequelize, Sequelize);


db.tableVersion = require("./version/version.model")(sequelize, Sequelize);



db.translation = require("./translation/translation.model")(sequelize, Sequelize);
db.language = require("./language/language.model")(sequelize, Sequelize);

db.refreshToken.belongsTo(db.user, {
  foreignKey: 'userId', targetKey: 'id'
});


db.user.hasOne(db.refreshToken, {
  foreignKey: 'userId', targetKey: 'id'
});
db.user.belongsTo(db.address, {
  foreignKey: 'primaryAddressId', targetKey: 'id'
});
db.user.belongsTo(db.card, {
  foreignKey: 'primaryPaymentId', targetKey: 'id'
});



db.address.belongsTo(db.user, {
  foreignKey: 'userId', targetKey: 'id'
});




db.card.belongsTo(db.user, {
  foreignKey: 'userId', targetKey: 'id'
});
db.card.belongsTo(db.address, {
  foreignKey: 'billingAddressId', targetKey: 'id'
});




db.order.belongsTo(db.user, {
  foreignKey: 'userId', targetKey: 'id'
});
db.order.belongsTo(db.address, {
  foreignKey: 'shippingAddressId', targetKey: 'id'
});
db.order.belongsTo(db.address, {
  foreignKey: 'billingAddressId', targetKey: 'id'
});
db.order.belongsTo(db.card, {
  foreignKey: 'paymentId', targetKey: 'id'
});



db.order.belongsTo(db.discount, {
  foreignKey: 'discountId', targetKey: 'id'
});



db.cart.belongsTo(db.user, {
  foreignKey: 'userId', targetKey: 'id'
});
db.cartItems.belongsTo(db.cart, {
  foreignKey: 'cartId', targetKey: 'id'
});
db.cartItems.belongsTo(db.products, {
  foreignKey: 'productId', targetKey: 'id'
});

db.productImages.belongsTo(db.products, {
  foreignKey: 'productId', targetKey: 'id'
});

db.role.belongsToMany(db.user, {
  through: "user_roles",
  foreignKey: "roleId",
  otherKey: "userId"
});

db.user.belongsToMany(db.role, {
  through: "user_roles",
  foreignKey: "userId",
  otherKey: "roleId"
});





db.ORDERSTATUS = ["pending", "shipped","delivered", "canceled"];
db.CARDTYPES = ["credit", "debit"];
db.ROLES = ["user", "admin", "moderator"];


//sequelize.sync();

// db.sequelize.sync().then(async () => {
//   try {
//     await db.language.drop();
//     console.log('Translation table has been deleted!');
//   } catch (error) {
//     console.error('Error deleting Translation table:', error);
//   }
// });
// async function getTableNames() {
//   try {
//     // Synchronize all defined models with the database
//     //await sequelize.sync();
//     const { tableVersion: TableVersion} = db;
//     // Get all model names
//     const modelNames = Object.keys(sequelize.models);

//     // Save model names to an array
//     const tableNames = [];
//     for (const modelName of modelNames) {
//       const tableName = sequelize.models[modelName].tableName;
//       if (tableName !== 'tableVersion') { // Skip adding TableVersion for 'jump' table
//         const existingTableVersion = await TableVersion.findOne({ where: { vof: tableName } });
//         if (!existingTableVersion) {
//           const newTableVersion = await TableVersion.create({
//             vid: generateId('v', 8),
//             vof: tableName,
//             vcurrent: 0.1
//           });
//           tableNames.push(tableName);
//         }      
//       }
//     }
     
//     console.log(tableNames)
//     return tableNames;
//   } catch (err) { 
//     console.error(err);
//   }
// }


// getTableNames()

// async function addColumn() {
//   try {
//     await sequelize.queryInterface.addColumn('products', 'productGroupId', {
//       type: Sequelize.INTEGER,
//       allowNull: false,
//       defaultValue: 0,
//     });
//     console.log('Successfully added productGroupId column to Products table');
//   } catch (error) {
//     console.error('Error adding group_id column to Products table:', error);
//   }
// }

//addColumn()
const { tableVersion: TableVersion,products:Products,productsTableVersion:ProductTableVersion} = db;



// async function updateProductGroupIds() {

//   const { v4: uuidv4 } = require('uuid');
  
//   const batchSize = 20; // Number of products per group

//   // Find all products
//   Products.findAll(
//     {
//       order: [['id', 'ASC']],
//     }
//   )
//     .then(products => {
//       // Group the products in batches of size batchSize
//       const batches = [];
//       for (let i = 0; i < products.length; i += batchSize) {
//         batches.push(products.slice(i, i + batchSize));
//       }
  
//       // Generate a unique productGroupId for each batch
//       const promises = batches.map(batch => {
//         const groupId = uuidv4();
//         return Promise.all(batch.map(product => {
//           return product.update({ productGroupId: groupId });
//         }));
//       });
  
//       return Promise.all(promises);
//     })
//     .then(results => {
//       console.log(`Updated ${results.flat().length} products with unique group ids`);
//     })
//     .catch(err => {
//       console.log(err);
//     });
// }


// //updateProductGroupIds() //dont touch is
 


async function updateProductGroupIds2() {
  try {
    const products = await Products.findAll({ attributes: ['productGroupId'] });
    const uniqueGroupIds = Array.from(new Set(products.map((product) => product.productGroupId)));
    //console.log(uniqueGroupIds)
    const productTableVersion = await ProductTableVersion.findAll({ attributes: ['productGroupIds'] });
    const exGroupIds = Array.from(new Set(productTableVersion.map((productTableVersion) => productTableVersion.productGroupIds)));
  
    //console.log(exGroupIds)
    const newGroupIds = uniqueGroupIds.filter((groupId) => !exGroupIds.includes(groupId));
   // console.log(newGroupIds)
    const rowsToInsert = newGroupIds.map((groupId) => ({ productGroupIds: groupId }));
    if (rowsToInsert.length > 0) {
      await ProductTableVersion.bulkCreate(rowsToInsert);
      console.log(`${rowsToInsert.length} Product group IDs updated successfully!`);
    } else {
      console.log('No new product group IDs to insert.');
    }
  } catch (error) {
    console.error('Error updating product group IDs:', error);
  }
}
async function deleteUnusedProductGroupIds() {
  try {
    const usedGroupIds = await Products.findAll({ attributes: ['productGroupId'] })
      .then((products) => products.map((product) => product.productGroupId));
    const unusedGroupIds = await ProductTableVersion.findAll({ 
      where: { 
        productGroupIds: { 
          [Sequelize.Op.notIn]: usedGroupIds
        }
      }, 
      attributes: ['productGroupIds'] 
    }).then((versions) => versions.map((version) => version.productGroupIds));

    if (unusedGroupIds.length > 0) {
      await ProductTableVersion.destroy({
        where: { 
          productGroupIds: {
            [Sequelize.Op.in]: unusedGroupIds
          }
        }
      });
      console.log(`${unusedGroupIds.length} Unused product group IDs deleted successfully!`);

    } else {
      console.log('No unused product group IDs to delete.');
    }
  } catch (error) {
    console.error('Error deleting unused product group IDs:', error);
  }
}
 



    //  setInterval(() => {
    //   updateProductGroupIds2();
    //   deleteUnusedProductGroupIds()
    //    }, 20000);
  









// Listen for create, update, and delete events on the Product model
Products.addHook('afterCreate', 'updateTableVersion', async (products, options) => {
  await updateProductTableVersion(products.productGroupId, 'create');
  await updateTableVersion('products', 'create');

});

Products.addHook('afterUpdate', 'updateTableVersion', async (products, options) => {
  console.log(products)
  await updateProductTableVersion(products.productGroupId, 'update');
  await updateTableVersion('products', 'update');
});

Products.addHook('afterDestroy', 'updateTableVersion', async (products, options) => {
  await updateProductTableVersion(products.productGroupId, 'delete');
  await updateTableVersion('products', 'delete');
});


async function updateTableVersion(tableName, action) {
  try {
    const tableVersion = await TableVersion.findOne({ where: { vof: tableName } });
    if (!tableVersion) {
      await TableVersion.create({
        vid: generateId('v', 8),
        vof: tableName,
        vcurrent: 0.1
      });
    } else {
      tableVersion.vcurrent = Number(tableVersion.vcurrent) + 0.1;
      await tableVersion.save();
    }
   // console.log(`TableVersions updated for ${tableName} (${action}).`);
  } catch (error) {
    console.error(`Error updating TableVersions for ${tableName} (${action}):`, error);
  }
}
async function updateProductTableVersion(tableName, action) {
  try {
    const tableVersion = await ProductTableVersion.findOne({ where: { productGroupIds: tableName } });
    if (!tableVersion) {
      console.error(`Error updating TableVersions for ${tableName} (${action}):`, error);
    } else {
      tableVersion.version =  parseFloat(tableVersion.version) + 0.1;
      await tableVersion.save();
    }
   // console.log(`TableVersions updated for ${tableName} (${action}).`);
  } catch (error) {
    console.error(`Error updating TableVersions for ${tableName} (${action}):`, error);
  }
}






  
module.exports = db;