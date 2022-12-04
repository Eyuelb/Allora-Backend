module.exports = (sequelize, Sequelize) => {
  const CartItems = sequelize.define("cartItems", {
    quantity: {
      type: Sequelize.INTEGER,
      //allowNull: false
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
 
  return CartItems;
};
