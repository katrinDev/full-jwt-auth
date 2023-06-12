const jwt = require("jsonwebtoken");
const TokenModel = require("../models/token-model.js");

class TokenService {
  generateTokens(payload) {
    const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
      expiresIn: "30m",
    });

    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
      expiresIn: "30d",
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  async saveToken(userId, refreshToken) {
    const tokenDataForThisUser = await TokenModel.findOne({ userId });
    if (tokenDataForThisUser) {
      tokenDataForThisUser.refreshToken = refreshToken;
      return tokenDataForThisUser.save();
    }

    const newTokenData = await TokenModel.create({
      userId,
      refreshToken,
    });

    return newTokenData;
  }
}

module.exports = new TokenService();
