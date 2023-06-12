const UserModel = require("../models/user-model.js");
const bcrypt = require("bcrypt");
const uuid = require("uuid");
const mailService = require("./mail-service.js");
const tokenService = require("./token-service.js");
const UserDto = require("../dtos/user-dto.js");

class UserService {
  async registration(email, password) {
    const sameUser = await UserModel.findOne({ email });
    if (sameUser) {
      throw new Error(`User with the email ${email} exists already`);
    }

    const hashPassword = bcrypt.hashSync(password, 3);
    const activationLink = uuid.v4(); //returns new random string
    const user = await UserModel.create({
      email,
      password: hashPassword,
      activationLink,
    });

    await mailService.sendActivationMail(email, activationLink);

    const userDto = new UserDto(user);
    const tokens = tokenService.generateTokens({ ...userDto }); //this function expects a simple objct as a parameter, not instance of UserDto class, so we use spread-operator

    await tokenService.saveToken(userDto.id, tokens.refreshToken);

    return { ...tokens, user: userDto };
  }
}

module.exports = new UserService();
