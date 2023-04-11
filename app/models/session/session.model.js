module.exports = (sequelize, Sequelize) => {
  const Session = sequelize.define("sessions", {
    sid: {
      type: Sequelize.INTEGER,
      primaryKey: true
    },
    data: {
      type: Sequelize.JSON
    },
    expires: {
      type: Sequelize.DATE
    }
  }, {
    tableName: 'sessions',
    timestamps: false,
  });


  return Session;
};
