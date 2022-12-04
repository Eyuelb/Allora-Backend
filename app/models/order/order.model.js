module.exports = (sequelize, Sequelize) => {
  const Order = sequelize.define("orders", {
    orderId: {
      type: Sequelize.STRING,
     // allowNull: false
    },
    orderedProducts: {
      type: Sequelize.JSON,
     // allowNull: false
    },
    status: {
      type: Sequelize.STRING,
      defaultValue: 'pending',
    },
    stripeChargeId: {
      type: Sequelize.STRING,
     // allowNull: false
    },
    amountCharged: {
      type: Sequelize.INTEGER,
     // allowNull: false
    },
    handledBy: {
        type: Sequelize.INTEGER,
        // allowNull defaults to true
    },
    viewed: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
  });
 
  return Order;
};
 