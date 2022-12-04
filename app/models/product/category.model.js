module.exports = (sequelize, Sequelize) => {
  const category = sequelize.define("categorys", {
    categoryName: {
      type: Sequelize.STRING,
      //allowNull: false
    },
    categoryDescription: {
      type: Sequelize.STRING,
      //allowNull: false
    },
    categoryParentID: {
      type: Sequelize.STRING,
      defaultValue: '0',
      //allowNull: false
    },
    categoryImage: {
      type: Sequelize.STRING,
      //allowNull: false
    },
    categoryVisibility: {
      type: Sequelize.BOOLEAN,
      defaultValue: true,
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

  return category;
};
