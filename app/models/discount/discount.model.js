module.exports = (sequelize, Sequelize) => {
  const Order = sequelize.define("discounts", {
    type: {
      type: Sequelize.STRING,
    },
    code: {
      type: Sequelize.STRING,
     // allowNull: false
    },
    amount: { 
      type: Sequelize.INTEGER,
     // allowNull: false 
    },
    startDate: { 
        type: Sequelize.DATE,
        // allowNull defaults to true
    },
    endDate: { 
      type: Sequelize.DATE,
      // allowNull defaults to true
  }

  });

  return Order;
};
