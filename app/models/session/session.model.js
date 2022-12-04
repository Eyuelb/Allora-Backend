module.exports = (sequelize, Sequelize) => {
  const Session = sequelize.define("sessions", {
    sid: {
      type: Sequelize.INTEGER,
      primaryKey: true
    },
    sess: {
      type: Sequelize.JSON
    },
    expire: {
      type: Sequelize.STRING
    }
  });

  return Session;
};
