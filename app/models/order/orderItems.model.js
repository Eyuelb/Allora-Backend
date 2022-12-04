module.exports = (sequelize, Sequelize) => {
  const OrderItems = sequelize.define("orderItems", {
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

  return OrderItems;
};
