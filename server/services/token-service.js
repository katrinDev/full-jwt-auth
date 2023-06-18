const jwt = require("jsonwebtoken");
const TokenModel = require("../models/token-model.js");
const tokenModel = require("../models/token-model.js");

class TokenService {
  generateTokens(payload) {
    const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
      expiresIn: "1m",
    });

    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
      expiresIn: "30d",
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  validateAccessToken(token) {
    try {
      const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
      return payload;
    } catch (e) {
      return null;
    }
  }

  validateRefreshToken(token) {
    try {
      const payload = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
      return payload;
    } catch (e) {
      return null;
    }
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

  async removeToken(refreshToken) {
    const tokenData = await tokenModel.deleteOne({ refreshToken });
    return tokenData;
  }

  async findToken(refreshToken) {
    const tokenData = await tokenModel.findOne({ refreshToken });
    return tokenData;
  }
}

module.exports = new TokenService();
