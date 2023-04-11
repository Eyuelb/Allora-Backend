const { v4: uuidv4 } = require("uuid");

module.exports = (sequelize, Sequelize) => {
  const RefreshToken = sequelize.define("refreshToken", {
    token: {
      type: Sequelize.STRING,
    },
    expiryDate: {
      type: Sequelize.DATE,
    },
  });

  RefreshToken.createToken = async function (user) {
    let expiredAt = new Date();
    const jwtRefreshExpiration = process.env.JWT_REFRESH_EXPIRATION | 0 || '';

    expiredAt.setSeconds(expiredAt.getSeconds() + jwtRefreshExpiration);
    let _token = uuidv4();
    let userDate = await RefreshToken.findOne({ where: { userId: user.id } })

    if (userDate) {
      if (userDate.expiryDate.getTime() > new Date().getTime()) {
        return userDate.token;
      }
      else {
        userDate.token = _token,
        userDate.expiryDate = expiredAt.getTime()
        await userDate.save();
        return userDate.token
        
      }
    }
    else {
      let refreshToken = await this.create({
        token: _token,
        userId: user.id,
        expiryDate: expiredAt.getTime(),
      });
      return refreshToken.token;
    }

  };

  RefreshToken.verifyExpiration = (token) => {
    return token.expiryDate.getTime() < new Date().getTime();
  };

  return RefreshToken;
};