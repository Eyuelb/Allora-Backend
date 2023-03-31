module.exports = (sequelize, Sequelize) => {
  const TableVersion = sequelize.define("tableVersion", {
    vid: {
      type: Sequelize.STRING,
    },
    vof: {
      type: Sequelize.STRING,
    },
    vcurrent: {
      type: Sequelize.STRING
    },
  });

  return TableVersion;
};
