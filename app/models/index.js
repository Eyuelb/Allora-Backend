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


db.product = require("./product/product.model")(sequelize, Sequelize);
db.brand = require("./product/brand.model")(sequelize, Sequelize);
db.category = require("./product/category.model")(sequelize, Sequelize);
db.manufacturingCountry = require("./product/manufacturingCountry.model")(sequelize, Sequelize);


db.session = require("./session/session.model")(sequelize, Sequelize);

db.discount = require("./discount/discount.model")(sequelize, Sequelize);

db.user = require("./user/user.model.js")(sequelize, Sequelize);
db.role = require("./user/role.model.js")(sequelize, Sequelize);
db.address = require("./user/address.model")(sequelize, Sequelize);



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
db.cartItems.belongsTo(db.product, {
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
module.exports = db;