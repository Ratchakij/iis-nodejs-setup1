const bcrypt = require("bcryptjs");

const { registerSchema, loginSchema } = require("../validators/auth-validator");

const userService = require("../services/user-service");
const tokenService = require("../services/token-service");

const createError = require("../utils/create-error");

exports.register = async (req, res, next) => {
  try {
    const { value, error } = registerSchema.validate(req.body);
    if (error) {
      return next(error);
    }

    const isUserExist = await userService.getUserByEmail(value.email);

    if (isUserExist) {
      return next(createError("Email already in use", 400));
    }

    value.password = await bcrypt.hash(value.password, 12);

    const user = await userService.createUser(value);

    const payload = { id: user.id };

    const accessToken = tokenService.sign(payload);

    delete user.password;
    res.status(200).json({ accessToken });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { value, error } = loginSchema.validate(req.body);
    if (error) {
      return next(error);
    }

    const user = await userService.getUserByEmail(value.email);

    if (!user) {
      return next(createError("invalid credential", 400));
    }

    const isMatch = await bcrypt.compare(value.password, user.password);
    if (!isMatch) {
      return next(createError("invalid credential", 400));
    }

    const payload = { id: user.id };
    const accessToken = tokenService.sign(payload);
    delete user.password; //ลบคุณสมบัติ (property) password ออกจากอ็อบเจ็กต์ user
    res.status(200).json({ accessToken });
  } catch (err) {
    next(err);
  }
};

exports.getMe = (req, res, next) => {
  res.status(200).json({ user: req.user });
};
