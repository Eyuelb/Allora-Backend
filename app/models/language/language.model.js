
module.exports = (sequelize, Sequelize) => {
  const Language = sequelize.define('language', {
    name: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
  });
  
    return Language;
  };
   