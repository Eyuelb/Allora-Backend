
module.exports = (sequelize, Sequelize) => {
    const Translation = sequelize.define('translation', {
        language: {
            type: Sequelize.STRING,
            allowNull: false
        },
        key: {
            type: Sequelize.STRING,
            allowNull: false
        },
        value: {
            type: Sequelize.TEXT,
            allowNull: false
        }
    });

    return Translation;
};
