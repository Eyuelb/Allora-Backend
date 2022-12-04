module.exports = (sequelize, Sequelize) => {
    const Card = sequelize.define("cards", {
      cardType: {
        type: Sequelize.STRING,
        defaultValue: 'credit',
      },
      cardNo: {
        type: Sequelize.INTEGER
      },
      cvv: {
        type: Sequelize.STRING,
      //  allowNull: false
      },
      expMonth: {
        type: Sequelize.INTEGER,
       // allowNull: false
      },
      expYear: {
        type: Sequelize.INTEGER,
       // allowNull: false
      },
    });
  
    return Card;
  };
  