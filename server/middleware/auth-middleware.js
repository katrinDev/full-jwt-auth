const ApiError = require("../exceptions/api-errors.js");
const tokenService = require("../services/token-service.js");

module.exports = function (req, res, next) {
  try {
    const authorizationHeader = req.headers.authorization;
    if (!authorizationHeader) {
      return next(ApiError.UnauthorizedError()); //need return to stop function execution
    }

    const accessToken = authorizationHeader.split(" ")[1];
    if (!accessToken) {
      return next(ApiError.UnauthorizedError());
    }

    const payload = tokenService.validateAccessToken(accessToken);
    if (!payload) {
      return next(ApiError.UnauthorizedError());
    }

    req.user = payload;
    next();
  } catch (e) {
    return next(ApiError.UnauthorizedError());
  }
};
