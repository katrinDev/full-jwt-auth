const UserModel = require("../models/user-model.js");
const bcrypt = require("bcrypt");
const uuid = require("uuid");
const mailService = require("./mail-service.js");
const tokenService = require("./token-service.js");
const UserDto = require("../dtos/user-dto.js");
const ApiError = require("../exceptions/api-errors.js");

class UserService {
  async registration(email, password) {
    const sameUser = await UserModel.findOne({ email });
    if (sameUser) {
      throw ApiError.BadRequest(`User with the email ${email} exists already`);
    }

    const hashPassword = bcrypt.hashSync(password, 3);
    const activationLink = uuid.v4(); //returns new random string

    await mailService.sendActivationMail(
      email,
      `${process.env.API_URL}/api/activate/${activationLink}`
    );

    const user = await UserModel.create({
      email,
      password: hashPassword,
      activationLink,
    });

    const userDto = new UserDto(user);
    const tokens = tokenService.generateTokens({ ...userDto }); //this function expects a simple objct as a parameter, not instance of UserDto class, so we use spread-operator

    await tokenService.saveToken(userDto.id, tokens.refreshToken);

    return { ...tokens, user: userDto };
  }

  async activate(activationLink) {
    const user = await UserModel.findOne({ activationLink });

    if (!user) {
      throw ApiError.BadRequest("Incorrect activation link!");
    }

    user.isActivated = true;
    await user.save();
  }

  async login(email, password) {
    const user = await UserModel.findOne({ email });

    if (!user) {
      throw ApiError.BadRequest("There is no user with such email");
    }

    const isPassValid = await bcrypt.compare(password, user.password);

    if (!isPassValid) {
      throw ApiError.BadRequest("Incorrect password");
    }

    const userDto = new UserDto(user);
    const tokens = tokenService.generateTokens({ ...userDto });

    await tokenService.saveToken(userDto.id, tokens.refreshToken);

    return { ...tokens, user: userDto };
  }

  async logout(refreshToken) {
    const token = await tokenService.removeToken(refreshToken);
    return token;
  }
}

module.exports = new UserService();
