module.exports = (sequelize, Sequelize) => {
  const Cart = sequelize.define("carts", {
    reminder: {
      type: Sequelize.STRING
    },
  });

  return Cart;
};
