module.exports = (sequelize, Sequelize) => {
  const OrderStatus = sequelize.define("orderStatus", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true
    },
    name: {
      type: Sequelize.STRING
    }
  });

  return OrderStatus;
};
