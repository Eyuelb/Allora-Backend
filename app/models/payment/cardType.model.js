module.exports = (sequelize, Sequelize) => {
  const CardType = sequelize.define("cardTypes", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true
    },
    name: {
      type: Sequelize.STRING
    }
  });

  return CardType;
};
