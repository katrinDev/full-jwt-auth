const UserModel = require("../models/user-model.js");
const bcrypt = require("bcrypt");
const uuid = require("uuid");
const mailService = require("./mail-service.js");
const tokenService = require("./token-service.js");
const UserDto = require("../dtos/user-dto.js");

class UserService {
  async registration(email, password) {
    try {
      const sameUser = await UserModel.findOne({ email });
      if (sameUser) {
        throw new Error(`User with the email ${email} exists already`);
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
    } catch (e) {
      throw new Error(e);
    }
  }
}

module.exports = new UserService();
